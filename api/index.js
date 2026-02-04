
// api/index.js
import { sql } from '@vercel/postgres';
import TelegramBot from 'node-telegram-bot-api';

// Vercel handles body parsing automatically, but we need to handle the response manually.

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_GROUP_ID = process.env.GROUP_ID;

// Initialize Bot (No polling in serverless!)
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

  // --- DATABASE INIT (Lazy) ---
  // In production, run this once manually or via a migration script.
  try {
    await sql`CREATE TABLE IF NOT EXISTS cases (
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
    );`;
  } catch (e) {
    console.error("DB Init Error:", e);
  }

  // --- ROUTING ---

  // 1. Telegram Webhook Endpoint
  if (url.includes('/api/telegram') && method === 'POST') {
    try {
      const update = body;
      
      // Handle Callback Query (Claim Case)
      if (update.callback_query) {
        const query = update.callback_query;
        const data = query.data;
        const userChatId = query.from.id;
        const studentName = query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : '');
        const studentUsername = query.from.username ? `@${query.from.username}` : studentName;

        if (data.startsWith('claim_')) {
          const caseId = data.split('_')[1];

          // Check Case Status
          const { rows } = await sql`SELECT * FROM cases WHERE id = ${caseId}`;
          const patientCase = rows[0];

          if (!patientCase) {
             await bot.answerCallbackQuery(query.id, { text: "حدث خطأ أو الحالة غير موجودة" });
          } else if (patientCase.status !== 'RECEIVED' && patientCase.status !== 'SENT_TO_STUDENTS') {
             await bot.answerCallbackQuery(query.id, { text: "⚠️ عذراً، تم حجز هذه الحالة بالفعل!", show_alert: true });
          } else {
             // Update DB
             await sql`UPDATE cases SET status = 'WAITING_ADMIN_APPROVAL', assignedStudent = ${studentUsername}, assignedStudentChatId = ${userChatId} WHERE id = ${caseId}`;
             
             // Responses
             await bot.answerCallbackQuery(query.id, { text: "✅ تم تسجيل طلبك! بانتظار موافقة الإدارة.", show_alert: true });
             
             // Update Group Message
             if (query.message) {
                const originalText = query.message.text;
                await bot.editMessageText(`${originalText}\n\n⏳ *جاري المراجعة لـ:* ${studentUsername}`, {
                  chat_id: query.message.chat.id,
                  message_id: query.message.message_id,
                  parse_mode: 'Markdown',
                  reply_markup: { inline_keyboard: [] }
                });
             }

             // DM Student
             await bot.sendMessage(userChatId, `⏳ لقد قمت بطلب الحالة رقم ${caseId}. يرجى الانتظار حتى يقوم المشرف بمراجعة طلبك.`);
          }
        }
      }

      // Handle normal messages (Optional: Log Chat ID)
      if (update.message) {
        // You can log chat ID here if needed for debugging
      }

      res.status(200).json({ ok: true });
    } catch (e) {
      console.error("Telegram Webhook Error:", e);
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // 2. Submit Case
  if (url.includes('/api/submit') && method === 'POST') {
    try {
      const data = body;
      const medicalHistoryStr = data.medicalHistory ? data.medicalHistory.join(', ') : '';
      const problemsStr = data.problems ? data.problems.join(', ') : '';

      await sql`INSERT INTO cases (id, fullName, phone, age, gender, district, problem, medicalHistory, notes, submissionDate) 
                VALUES (${data.id}, ${data.fullName}, ${data.phone}, ${data.age}, ${data.gender}, ${data.district}, ${problemsStr}, ${medicalHistoryStr}, ${data.additionalNotes}, ${data.submissionDate})`;

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

  // 3. Get Cases
  if (url.includes('/api/cases') && method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM cases ORDER BY submissionDate DESC`;
      res.status(200).json({ cases: rows });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  // 4. Approve Assignment
  if (url.includes('/api/approve-assignment') && method === 'POST') {
    try {
      const { caseId } = body;
      
      const { rows } = await sql`SELECT * FROM cases WHERE id = ${caseId}`;
      const row = rows[0];

      if (!row || !row.assignedstudentchatid) {
        res.status(404).json({ error: "Case or Student Chat ID not found" });
        return;
      }

      await sql`UPDATE cases SET status = 'APPROVED_FOR_TREATMENT' WHERE id = ${caseId}`;

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

  res.status(404).json({ message: "Route not found" });
}
