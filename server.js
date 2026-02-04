
/**
 * Alexandria Dental Care - Backend Server
 * 
 * Instructions:
 * 1. Install dependencies: npm install express cors sqlite3 node-telegram-bot-api body-parser
 * 2. Get Token from @BotFather
 * 3. Set environment variables or update the constants below
 * 4. Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURATION ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_GROUP_ID = process.env.GROUP_ID || 'YOUR_GROUP_ID_HERE'; // e.g., -100123456789

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE SETUP ---
const db = new sqlite3.Database('./dental_cases.db', (err) => {
  if (err) console.error('DB Error:', err.message);
  else console.log('Connected to SQLite database.');
});

db.serialize(() => {
  // Added medicalHistory column
  db.run(`CREATE TABLE IF NOT EXISTS cases (
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
  )`);
});

// --- TELEGRAM BOT SETUP ---
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Handle "Claim Case" button clicks
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id; // Group Chat ID
  const userChatId = query.from.id; // Student Private Chat ID
  const studentName = query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : '');
  const studentUsername = query.from.username ? `@${query.from.username}` : studentName;
  const data = query.data;

  if (data.startsWith('claim_')) {
    const caseId = data.split('_')[1];

    // Check DB status
    db.get("SELECT * FROM cases WHERE id = ?", [caseId], (err, row) => {
      if (err || !row) {
        bot.answerCallbackQuery(query.id, { text: "حدث خطأ أو الحالة غير موجودة" });
        return;
      }

      if (row.status !== 'RECEIVED' && row.status !== 'SENT_TO_STUDENTS') {
        bot.answerCallbackQuery(query.id, { text: "⚠️ عذراً، تم حجز هذه الحالة بالفعل!", show_alert: true });
        return;
      }

      // 1. Update DB to WAITING_ADMIN_APPROVAL (Do NOT assign yet)
      db.run("UPDATE cases SET status = ?, assignedStudent = ?, assignedStudentChatId = ? WHERE id = ?", 
        ['WAITING_ADMIN_APPROVAL', studentUsername, userChatId, caseId], 
        (updateErr) => {
          if (updateErr) return;

          // 2. Alert Student (Popup)
          bot.answerCallbackQuery(query.id, { 
            text: "✅ تم تسجيل طلبك! الحالة الآن بانتظار موافقة الإدارة. ستصلك التفاصيل في رسالة خاصة بعد الموافقة.", 
            show_alert: true 
          });

          // 3. Update Group Message (Indicate Pending)
          const originalText = query.message.text;
          bot.editMessageText(`${originalText}\n\n⏳ *جاري المراجعة لـ:* ${studentUsername}`, {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [] } // Remove buttons to prevent double claiming
          });
          
          // 4. Send Confirmation to Student DM
          bot.sendMessage(userChatId, `⏳ لقد قمت بطلب الحالة رقم ${caseId}. يرجى الانتظار حتى يقوم المشرف بمراجعة طلبك وإرسال بيانات المريض.`);
        }
      );
    });
  }
});

// --- API ENDPOINTS ---

// Submit a new case
app.post('/api/submit', (req, res) => {
  const data = req.body;
  
  const stmt = db.prepare(`INSERT INTO cases (id, fullName, phone, age, gender, district, problem, medicalHistory, notes, submissionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  const medicalHistoryStr = data.medicalHistory ? data.medicalHistory.join(', ') : '';

  stmt.run(
    data.id, 
    data.fullName, 
    data.phone, 
    data.age, 
    data.gender, 
    data.district, 
    data.problems.join(', '),
    medicalHistoryStr,
    data.additionalNotes, 
    data.submissionDate, 
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }

      // Format Message for Group (HIDE SENSITIVE INFO)
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

      // Send to Group with Button
      bot.sendMessage(TELEGRAM_GROUP_ID, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "✋ طلب استلام الحالة", callback_data: `claim_${data.id}` }]
          ]
        }
      });

      res.json({ success: true, id: data.id });
    }
  );
  stmt.finalize();
});

// Admin approves assignment -> Send Private DM
app.post('/api/approve-assignment', (req, res) => {
  const { caseId } = req.body;

  db.get("SELECT * FROM cases WHERE id = ?", [caseId], (err, row) => {
    if (err || !row || !row.assignedStudentChatId) {
      return res.status(404).json({ error: "Case or Student Chat ID not found" });
    }

    // Update Status to APPROVED
    db.run("UPDATE cases SET status = 'APPROVED_FOR_TREATMENT' WHERE id = ?", [caseId], () => {
      
      // Send Private DM with FULL Details
      const patientDetails = `
✅ *تمت الموافقة على طلبك!*

🆔 رقم الحالة: \`${row.id}\`
👤 اسم المريض: ${row.fullName}
📞 رقم الهاتف: \`${row.phone}\`
📍 المنطقة: ${row.district}

🏥 *التاريخ المرضي:*
${row.medicalHistory || "لا يوجد"}

📝 *ملاحظات:*
${row.notes || "لا يوجد"}

يرجى التواصل مع المريض فوراً. بالتوفيق! 🦷
      `.trim();

      bot.sendMessage(row.assignedStudentChatId, patientDetails, { parse_mode: 'Markdown' })
        .then(() => res.json({ success: true }))
        .catch(e => res.status(500).json({ error: e.message }));
    });
  });
});

// Get cases
app.get('/api/cases', (req, res) => {
  db.all("SELECT * FROM cases ORDER BY submissionDate DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ cases: rows });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
