
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
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8440495160:AAG3Yg0goaoIRA-B9YsKDOKX_wEvPEMjlsE';
const TELEGRAM_GROUP_ID = process.env.GROUP_ID || '-1003860053498'; // e.g., -100123456789

// Check Config
if (TELEGRAM_TOKEN === '8440495160:AAG3Yg0goaoIRA-B9YsKDOKX_wEvPEMjlsE' || TELEGRAM_GROUP_ID === '-1003860053498') {
  console.warn("⚠️  WARNING: Telegram Bot Token or Group ID is not set. Telegram features will fail.");
}

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE SETUP ---
const db = new sqlite3.Database('./dental_cases.db', (err) => {
  if (err) console.error('DB Error:', err.message);
  else console.log('Connected to SQLite database.');
});

db.serialize(() => {
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

  db.run(`CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    fullName TEXT,
    universityId TEXT,
    email TEXT,
    password TEXT,
    status TEXT DEFAULT 'PENDING',
    registrationDate TEXT,
    telegramChatId TEXT
  )`);
});

// --- TELEGRAM BOT SETUP ---
let bot = null;
if (TELEGRAM_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
    bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    console.log("✅ Telegram Bot initialized with polling.");

    // Handle "Claim Case" button clicks (Robust Logic)
    bot.on('callback_query', (query) => {
      const chatId = query.message.chat.id; // Group Chat ID
      const userChatId = query.from.id; // Student Private Chat ID
      const studentName = query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : '');
      const studentUsername = query.from.username ? `@${query.from.username}` : studentName;
      const data = query.data;

      if (data.startsWith('claim_')) {
        const caseId = data.split('_')[1];

        // 1. Transaction-like check to prevent race conditions
        db.get("SELECT * FROM cases WHERE id = ?", [caseId], (err, row) => {
          if (err || !row) {
            bot.answerCallbackQuery(query.id, { text: "❌ حدث خطأ: الحالة غير موجودة في النظام." });
            return;
          }

          // STRICT CHECK: Case must be in 'SENT_TO_STUDENTS' state only
          // This prevents two students from claiming the same case
          if (row.status !== 'SENT_TO_STUDENTS') {
            bot.answerCallbackQuery(query.id, { text: "⚠️ عذراً، هذه الحالة تم حجزها بالفعل من قبل طالب آخر.", show_alert: true });
            
            // Remove button from message to prevent further clicks
            bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
              chat_id: chatId,
              message_id: query.message.message_id
            }).catch(() => {});
            return;
          }

          // 2. Atomic Update (Lock the case)
          // We assume 'IN_TREATMENT' or 'APPROVED_FOR_TREATMENT' means claimed
          db.run("UPDATE cases SET status = ?, assignedStudent = ?, assignedStudentChatId = ? WHERE id = ?", 
            ['APPROVED_FOR_TREATMENT', studentUsername, userChatId, caseId], 
            (updateErr) => {
              if (updateErr) {
                bot.answerCallbackQuery(query.id, { text: "حدث خطأ في قاعدة البيانات. حاول مرة أخرى." });
                return;
              }

              // 3. Notify Student (Popup)
              bot.answerCallbackQuery(query.id, { 
                text: "✅ تم استلام الحالة بنجاح! راجع الرسائل الخاصة للتفاصيل.", 
                show_alert: true 
              });

              // 4. Update Group Message (Remove Button & Show Owner)
              const originalText = query.message.text;
              const cleanText = originalText.split('👇')[0].trim(); 
              
              bot.editMessageText(`${cleanText}\n\n🔒 *تم الحجز بواسطة:* ${studentUsername}`, {
                chat_id: chatId,
                message_id: query.message.message_id,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [] } // Remove buttons
              });
              
              // 5. Send Private DM with SENSITIVE DETAILS
              const privateMessage = `
🎉 *تهانينا! تم إسناد الحالة لك.*

📝 *تفاصيل المريض:*
🆔 رقم الملف: \`${row.id}\`
👤 الاسم: *${row.fullName}*
📞 الهاتف: \`${row.phone}\`
📍 المنطقة: ${row.district}

⚠️ *التاريخ المرضي:*
${row.medicalHistory || "لا توجد أمراض مزمنة معلنة"}

💬 *ملاحظات:*
${row.notes || "لا يوجد"}

📌 *تعليمات هامة:*
1. تواصل مع المريض فوراً لتحديد الموعد.
2. تأكد من أخذ تاريخ مرضي مفصل في أول زيارة.
3. أنت المسؤول قانونياً وأكاديمياً عن هذه الحالة أمام المشرف.

بالتوفيق يا دكتور! 🦷
              `.trim();

              bot.sendMessage(userChatId, privateMessage, { parse_mode: 'Markdown' })
                .then(() => {
                   console.log(`Sent DM to ${studentUsername} (${userChatId})`);
                })
                .catch((e) => {
                   console.error(`Failed to DM student ${studentUsername}:`, e.message);
                   bot.sendMessage(chatId, `⚠️ تنبيه لـ ${studentUsername}: لم نتمكن من إرسال تفاصيل المريض لك. تأكد من أنك بدأت المحادثة مع البوت @${process.env.BOT_USERNAME || 'bot'}`);
                });
            }
          );
        });
      }
    });

    bot.on('polling_error', (error) => {
       console.error("Telegram Polling Error:", error.code); 
    });
} else {
    console.log("❌ Telegram Bot NOT initialized (Missing Token).");
}

// --- API ENDPOINTS ---

// Submit a new case (Patient Side)
app.post('/api/submit', (req, res) => {
  const data = req.body;
  const stmt = db.prepare(`INSERT INTO cases (id, fullName, phone, age, gender, district, problem, medicalHistory, notes, submissionDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'RECEIVED')`);
  
  const medicalHistoryStr = data.medicalHistory ? data.medicalHistory.join(', ') : '';
  const problemStr = data.problems ? data.problems.join(', ') : '';

  stmt.run(
    data.id, 
    data.fullName, 
    data.phone, 
    data.age, 
    data.gender, 
    data.district, 
    problemStr,
    medicalHistoryStr,
    data.additionalNotes, 
    data.submissionDate, 
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Database error" });
      }
      res.json({ success: true, id: data.id });
    }
  );
  stmt.finalize();
});

// Publish Case (Admin Side) - Triggers Telegram
app.post('/api/cases/publish', (req, res) => {
  const { id } = req.body;

  if (!bot) {
      return res.status(500).json({ error: "خطأ: بوت التيليجرام غير مفعل على السيرفر." });
  }
  
  db.get("SELECT * FROM cases WHERE id = ?", [id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "الحالة غير موجودة" });
    }

    // 1. Update Status first
    db.run("UPDATE cases SET status = 'SENT_TO_STUDENTS' WHERE id = ?", [id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "فشل تحديث قاعدة البيانات" });

      // 2. Format Telegram Message
      const problemsArr = row.problem ? row.problem.split(', ') : [];
      const message = `
📢 *حالة جديدة متاحة للحجز* 🦷

🆔 *رقم الحالة:* \`${row.id}\`
🎂 *العمر:* ${row.age} | ${row.gender}
📍 *المنطقة:* ${row.district}

🛑 *الشكوى الرئيسية:*
${problemsArr.map(p => `- ${p}`).join('\n')}

⚠️ *تنبيه:* بيانات الاتصال والتاريخ المرضي مخفية. ستظهر فقط للطالب الذي يقوم بالحجز أولاً.

👇 اضغط على الزر أدناه لاستلام الحالة فوراً
      `.trim();

      // 3. Send to Group with Claim Button
      bot.sendMessage(TELEGRAM_GROUP_ID, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ استلام الحالة (حجز فوري)", callback_data: `claim_${row.id}` }]
          ]
        }
      }).then(() => {
        res.json({ success: true });
      }).catch((tgErr) => {
        console.error("Telegram Error:", tgErr.message);
        res.status(500).json({ error: "فشل الإرسال لتيليجرام: " + tgErr.message });
      });
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

// Delete Case
app.delete('/api/cases', (req, res) => {
  const { id } = req.query; // Use query for DELETE
  db.run("DELETE FROM cases WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Update Case Status (Generic)
app.post('/api/cases/update', (req, res) => {
  const { id, status } = req.body;
  db.run("UPDATE cases SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- STUDENT ENDPOINTS ---
app.get('/api/students', (req, res) => {
  db.all("SELECT * FROM students ORDER BY registrationDate DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ students: rows });
  });
});

app.delete('/api/students', (req, res) => {
  const { id } = req.query;
  db.run("DELETE FROM students WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/students/update', (req, res) => {
  const { id, status } = req.body;
  db.run("UPDATE students SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/student/register', (req, res) => {
  const { fullName, universityId, email, password } = req.body;
  const id = 'ST-' + Math.floor(10000 + Math.random() * 90000);
  const now = new Date().toISOString();

  const stmt = db.prepare(`INSERT INTO students (id, fullName, universityId, email, password, status, registrationDate) VALUES (?, ?, ?, ?, ?, 'PENDING', ?)`);
  stmt.run(id, fullName, universityId, email, password, now, function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
  stmt.finalize();
});

app.post('/api/student/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM students WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
        if (row.status === 'PENDING') return res.json({ success: false, message: 'حسابك لا يزال قيد المراجعة' });
        if (row.status === 'REJECTED') return res.json({ success: false, message: 'تم رفض الحساب' });
        res.json({ success: true, student: row });
    } else {
      res.json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Telegram Bot: ${bot ? 'Active' : 'Disabled (No Token)'}`);
});
