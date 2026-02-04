
// api/index.js
import pg from 'pg';
import TelegramBot from 'node-telegram-bot-api';

const { Pool } = pg;

// Initialize Postgres Pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_GROUP_ID = process.env.GROUP_ID;

const bot = new TelegramBot(TELEGRAM_TOKEN);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method, body } = req;

  // --- DATABASE INIT ---
  try {
    // Create Cases Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        fullName TEXT,
        phone TEXT,
        age INTEGER,
        gender TEXT,
        district TEXT,
        problem TEXT,
        medicalHistory TEXT,
        notes TEXT,
        status TEXT DEFAULT 'RECEIVED',
        assignedStudent TEXT,
        assignedStudentChatId TEXT,
        submissionDate TEXT
      )
    `);

    // Create Students Table (New)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        fullName TEXT,
        universityId TEXT,
        email TEXT,
        password TEXT,
        status TEXT DEFAULT 'PENDING',
        registrationDate TEXT,
        telegramChatId TEXT
      )
    `);
  } catch (e) {
    console.error("DB Init Error:", e);
  }

  // --- 1. TELEGRAM WEBHOOK ---
  if (url.includes('/api/telegram') && method === 'POST') {
    try {
      const update = body;

      // Handle "Claim Case" Button
      if (update.callback_query) {
        const query = update.callback_query;
        const data = query.data;
        const userChatId = query.from.id;
        const studentName = query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : '');
        const studentUsername = query.from.username ? `@${query.from.username}` : studentName;

        if (data.startsWith('claim_')) {
          const caseId = data.split('_')[1];

          // Check Case
          const { rows } = await pool.query('SELECT * FROM cases WHERE id = $1', [caseId]);
          const patientCase = rows[0];

          if (!patientCase) {
             await bot.answerCallbackQuery(query.id, { text: "حدث خطأ أو الحالة غير موجودة" });
          } else if (patientCase.status !== 'RECEIVED' && patientCase.status !== 'SENT_TO_STUDENTS') {
             await bot.answerCallbackQuery(query.id, { text: "⚠️ عذراً، تم حجز هذه الحالة بالفعل!", show_alert: true });
          } else {
             // Update Case
             await pool.query(
               'UPDATE cases SET status = $1, assignedStudent = $2, assignedStudentChatId = $3 WHERE id = $4',
               ['WAITING_ADMIN_APPROVAL', studentUsername, userChatId, caseId]
             );
             
             await bot.answerCallbackQuery(query.id, { text: "✅ تم تسجيل طلبك! بانتظار موافقة الإدارة.", show_alert: true });
             
             if (query.message) {
                const originalText = query.message.text;
                await bot.editMessageText(`${originalText}\n\n⏳ *جاري المراجعة لـ:* ${studentUsername}`, {
                  chat_id: query.message.chat.id,
                  message_id: query.message.message_id,
                  parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [] }
                });
             }
             await bot.sendMessage(userChatId, `⏳ لقد قمت بطلب الحالة رقم ${caseId}. يرجى الانتظار حتى يقوم المشرف بمراجعة طلبك.`);
          }
        }
      }
      res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // --- 2. CASE MANAGEMENT ---

  // Submit Case
  if (url.includes('/api/submit') && method === 'POST') {
    try {
      const data = body;
      const medicalHistoryStr = data.medicalHistory ? data.medicalHistory.join(', ') : '';
      const problemsStr = data.problems ? data.problems.join(', ') : '';

      await pool.query(
        `INSERT INTO cases (id, fullName, phone, age, gender, district, problem, medicalHistory, notes, submissionDate) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [data.id, data.fullName, data.phone, data.age, data.gender, data.district, problemsStr, medicalHistoryStr, data.additionalNotes, data.submissionDate]
      );

      // Notify Group
      const message = `
📢 *حالة جديدة متاحة* 🦷

🆔 *رقم الحالة:* ${data.id}
🎂 *العمر:* ${data.age} | ${data.gender}
📍 *المنطقة:* ${data.district}

🛑 *الشكوى:*
${data.problems.map(p => `- ${p}`).join('\n')}

⚠️ *تنبيه:* التفاصيل الطبية وبيانات الاتصال ستصل للطالب الموافق عليه فقط.

👇 اضغط لطلب الحالة
      `.trim();

      if (TELEGRAM_GROUP_ID && TELEGRAM_TOKEN) {
        await bot.sendMessage(TELEGRAM_GROUP_ID, message, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: "✋ طلب استلام الحالة", callback_data: `claim_${data.id}` }]
            ]
          }
        });
      }

      res.status(200).json({ success: true, id: data.id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
    return;
  }

  // Get Cases
  if (url.includes('/api/cases') && method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM cases ORDER BY submissionDate DESC');
      res.status(200).json({ cases: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // Approve Assignment
  if (url.includes('/api/approve-assignment') && method === 'POST') {
    try {
      const { caseId } = body;
      const { rows } = await pool.query('SELECT * FROM cases WHERE id = $1', [caseId]);
      const row = rows[0];

      if (!row || !row.assignedstudentchatid) {
        res.status(404).json({ error: "Case or Student Chat ID not found" });
        return;
      }

      await pool.query("UPDATE cases SET status = 'APPROVED_FOR_TREATMENT' WHERE id = $1", [caseId]);

      const patientDetails = `
✅ *تمت الموافقة على طلبك!*

🆔 رقم الحالة: \`${row.id}\`
👤 اسم المريض: ${row.fullname}
📞 رقم الهاتف: \`${row.phone}\`
📍 المنطقة: ${row.district}

🏥 *التاريخ المرضي:*
${row.medicalhistory || "لا يوجد"}

📝 *ملاحظات:*
${row.notes || "لا يوجد"}

يرجى التواصل مع المريض فوراً. بالتوفيق! 🦷
      `.trim();

      await bot.sendMessage(row.assignedstudentchatid, patientDetails, { parse_mode: 'Markdown' });
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // --- 3. STUDENT MANAGEMENT ---

  // Register Student
  if (url.includes('/api/student/register') && method === 'POST') {
    try {
      const { fullName, universityId, email, password } = body;
      const id = 'ST-' + Math.floor(10000 + Math.random() * 90000);
      const now = new Date().toISOString();

      await pool.query(
        `INSERT INTO students (id, fullName, universityId, email, password, status, registrationDate)
         VALUES ($1, $2, $3, $4, $5, 'PENDING', $6)`,
        [id, fullName, universityId, email, password, now]
      );
      
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
    return;
  }

  // Login Student
  if (url.includes('/api/student/login') && method === 'POST') {
    try {
      const { email, password } = body;
      const { rows } = await pool.query('SELECT * FROM students WHERE email = $1 AND password = $2', [email, password]);
      
      if (rows.length > 0) {
        const student = rows[0];
        if (student.status === 'PENDING') {
          res.status(200).json({ success: false, message: 'حسابك لا يزال قيد المراجعة' });
        } else if (student.status === 'REJECTED') {
          res.status(200).json({ success: false, message: 'تم رفض طلب تسجيلك' });
        } else {
          res.status(200).json({ success: true, student });
        }
      } else {
        res.status(200).json({ success: false, message: 'البيانات غير صحيحة' });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(404).json({ message: "Route not found" });
}
