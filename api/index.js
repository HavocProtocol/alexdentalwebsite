
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

  const { url, method, body, query } = req;

  // --- DATABASE INIT ---
  try {
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

      if (update.callback_query) {
        const query = update.callback_query;
        const data = query.data;
        const userChatId = query.from.id;
        const studentName = query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : '');
        const studentUsername = query.from.username ? `@${query.from.username}` : studentName;

        if (data.startsWith('claim_')) {
          const caseId = data.split('_')[1];

          // Fetch Case
          const { rows } = await pool.query('SELECT * FROM cases WHERE id = $1', [caseId]);
          const patientCase = rows[0];

          if (!patientCase) {
             await bot.answerCallbackQuery(query.id, { text: "❌ خطأ: الحالة غير موجودة" });
          } else if (patientCase.status !== 'SENT_TO_STUDENTS') {
             // RACE CONDITION CHECK
             await bot.answerCallbackQuery(query.id, { text: "⚠️ عذراً، تم حجز الحالة من قبل زميل آخر.", show_alert: true });
             // Attempt to remove button if stale
             try {
                await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id
                });
             } catch (e) {}
          } else {
             // IMMEDIATE ASSIGNMENT
             await pool.query(
               "UPDATE cases SET status = 'IN_TREATMENT', assignedStudent = $1, assignedStudentChatId = $2 WHERE id = $3",
               [studentUsername, userChatId, caseId]
             );
             
             await bot.answerCallbackQuery(query.id, { text: "✅ تم استلام الحالة بنجاح!", show_alert: true });
             
             // Update Group Message
             if (query.message) {
                const originalText = query.message.text;
                const cleanText = originalText.split('👇')[0].trim();
                await bot.editMessageText(`${cleanText}\n\n🔒 *تم الحجز بواسطة:* ${studentUsername}`, {
                  chat_id: query.message.chat.id,
                  message_id: query.message.message_id,
                  parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [] }
                });
             }
             
             // Send Private DM with Sensitive Data
             const privateMessage = `
🎉 *تهانينا! تم إسناد الحالة لك.*

📝 *تفاصيل المريض الكاملة:*
🆔 رقم الملف: \`${patientCase.id}\`
👤 الاسم: *${patientCase.fullname}*
📞 الهاتف: \`${patientCase.phone}\`
📍 المنطقة: ${patientCase.district}

⚠️ *التاريخ المرضي:*
${patientCase.medicalhistory || "لا يوجد"}

💬 *ملاحظات:*
${patientCase.notes || "لا يوجد"}

يرجى التواصل مع المريض فوراً.
             `.trim();
             
             await bot.sendMessage(userChatId, privateMessage, { parse_mode: 'Markdown' });
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

  // Submit Case (Patient)
  if (url.includes('/api/submit') && method === 'POST') {
    try {
      const data = body;
      const medicalHistoryStr = data.medicalHistory ? data.medicalHistory.join(', ') : '';
      const problemsStr = data.problems ? data.problems.join(', ') : '';

      // Force status RECEIVED. Do NOT send to Telegram yet.
      await pool.query(
        `INSERT INTO cases (id, fullName, phone, age, gender, district, problem, medicalHistory, notes, submissionDate, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'RECEIVED')`,
        [data.id, data.fullName, data.phone, data.age, data.gender, data.district, problemsStr, medicalHistoryStr, data.additionalNotes, data.submissionDate]
      );

      res.status(200).json({ success: true, id: data.id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
    return;
  }

  // Publish Case (Admin Only)
  if (url.includes('/api/cases/publish') && method === 'POST') {
    try {
      const { id } = body;
      
      const { rows } = await pool.query('SELECT * FROM cases WHERE id = $1', [id]);
      const data = rows[0];

      if (!data) {
        res.status(404).json({ error: "Case not found" });
        return;
      }

      await pool.query("UPDATE cases SET status = 'SENT_TO_STUDENTS' WHERE id = $1", [id]);

      // SANITIZED Message for Group
      const problemsArr = data.problem ? data.problem.split(', ') : [];
      const message = `
📢 *حالة جديدة متاحة للحجز* 🦷

🆔 *رقم الحالة:* \`${data.id}\`
🎂 *العمر:* ${data.age} | ${data.gender}
📍 *المنطقة:* ${data.district}

🛑 *الشكوى الرئيسية:*
${problemsArr.map(p => `- ${p}`).join('\n')}

⚠️ *تنبيه:* بيانات الاتصال والتاريخ المرضي مخفية. ستظهر فقط للطالب الذي يقوم بالحجز أولاً.

👇 اضغط على الزر أدناه لاستلام الحالة فوراً
      `.trim();

      if (TELEGRAM_GROUP_ID && TELEGRAM_TOKEN) {
        await bot.sendMessage(TELEGRAM_GROUP_ID, message, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: "✅ استلام الحالة (حجز فوري)", callback_data: `claim_${data.id}` }]
            ]
          }
        });
      }

      res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // Get Cases
  if (url.includes('/api/cases') && method === 'GET') {
    try {
        const { rows } = await pool.query('SELECT * FROM cases ORDER BY submissionDate DESC');
        const cases = rows.map(r => ({
            ...r,
            problems: r.problem ? r.problem.split(', ') : [],
            medicalHistory: r.medicalhistory ? r.medicalhistory.split(', ') : [],
            additionalNotes: r.notes,
            assignedStudentId: r.assignedstudentchatid ? 'LINKED' : null
        }));
        res.status(200).json({ cases });
        return;
    } catch (e) {
      res.status(500).json({ error: e.message });
      return;
    }
  }

  // Delete Case
  if (url.includes('/api/cases') && method === 'DELETE') {
    try {
        // Vercel routes usually pass query params. Expecting /api/cases?id=...
        const id = query.id; 
        if (!id) {
           res.status(400).json({ error: "Missing ID" });
           return;
        }
        await pool.query('DELETE FROM cases WHERE id = $1', [id]);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
    return;
  }

  // Update Case Status
  if (url.includes('/api/cases/update') && method === 'POST') {
      try {
          const { id, status } = body;
          await pool.query('UPDATE cases SET status = $1 WHERE id = $2', [status, id]);
          res.status(200).json({ success: true });
      } catch (e) {
          res.status(500).json({ error: e.message });
      }
      return;
  }

  // Student Endpoints (Same as before)
  if (url.includes('/api/students') && method === 'GET') {
      try {
          const { rows } = await pool.query('SELECT * FROM students ORDER BY registrationDate DESC');
          res.status(200).json({ students: rows });
      } catch (e) {
          res.status(500).json({ error: e.message });
      }
      return;
  }

  // Delete Student
  if (url.includes('/api/students') && method === 'DELETE') {
    try {
        const id = query.id;
        if (!id) {
           res.status(400).json({ error: "Missing ID" });
           return;
        }
        await pool.query('DELETE FROM students WHERE id = $1', [id]);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
    return;
  }

  if (url.includes('/api/students/update') && method === 'POST') {
      try {
          const { id, status } = body;
          await pool.query('UPDATE students SET status = $1 WHERE id = $2', [status, id]);
          res.status(200).json({ success: true });
      } catch(e) {
          res.status(500).json({ error: e.message });
      }
      return;
  }

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
