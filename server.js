
/**
 * Alexandria Dental Care - Backend Server
 * 
 * Instructions:
 * 1. Install dependencies: npm install express cors sqlite3 node-telegram-bot-api body-parser crypto
 * 2. Get Token from @BotFather
 * 3. Set environment variables or update the constants below
 * 4. Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// --- CONFIGURATION ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8440495160:AAG3Yg0goaoIRA-B9YsKDOKX_wEvPEMjlsE';
const TELEGRAM_GROUP_ID = process.env.GROUP_ID || '-1003860053498'; // e.g., -100123456789
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173'; // Frontend URL

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
    submissionDate TEXT,
    claimToken TEXT
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
    console.log("✅ Telegram Bot initialized.");
    // Bot error handling
    bot.on('polling_error', (error) => console.log(error.code));
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
      
      // Notify Admins privately via bot if configured (optional)
      // bot.sendMessage(ADMIN_ID, "New case received: " + data.id);

      res.json({ success: true, id: data.id });
    }
  );
  stmt.finalize();
});

// Publish Case (Admin Side) - Generates Token & Sends Link to Telegram
app.post('/api/cases/publish', (req, res) => {
  const { id } = req.body;

  if (!bot) {
      return res.status(500).json({ error: "خطأ: بوت التيليجرام غير مفعل على السيرفر." });
  }
  
  db.get("SELECT * FROM cases WHERE id = ?", [id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "الحالة غير موجودة" });
    }

    // Generate Secure Token
    const token = crypto.randomBytes(32).toString('hex');

    // Update Status & Token
    db.run("UPDATE cases SET status = 'SENT_TO_STUDENTS', claimToken = ? WHERE id = ?", [token, id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "فشل تحديث قاعدة البيانات" });

      const problemsArr = row.problem ? row.problem.split(', ') : [];
      const message = `
📢 *حالة جديدة متاحة للحجز* 🦷

🆔 *رقم الحالة:* \`${row.id}\`
🎂 *العمر:* ${row.age} | ${row.gender}
📍 *المنطقة:* ${row.district}

🛑 *الشكوى الرئيسية:*
${problemsArr.map(p => `- ${p}`).join('\n')}

⚠️ *تنبيه:* بيانات المريض مخفية. يجب تسجيل الدخول للمنصة لقبول الحالة.

👇 اضغط على الرابط أدناه لعرض التفاصيل وقبول الحالة
      `.trim();

      // Send Link Button (Not Callback)
      const claimUrl = `${SITE_URL}/#/claim/${token}`;

      bot.sendMessage(TELEGRAM_GROUP_ID, message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔗 عرض التفاصيل وقبول الحالة", url: claimUrl }]
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

// Verify Token & Get Case Preview (Secure)
app.get('/api/cases/claim-info/:token', (req, res) => {
    const { token } = req.params;
    
    db.get("SELECT id, age, gender, district, problem, status FROM cases WHERE claimToken = ?", [token], (err, row) => {
        if (err) return res.status(500).json({ error: "خطأ في قاعدة البيانات" });
        if (!row) return res.status(404).json({ error: "الرابط غير صالح أو منتهي الصلاحية" });
        
        if (row.status !== 'SENT_TO_STUDENTS') {
            return res.status(400).json({ error: "عذراً، هذه الحالة تم حجزها بالفعل أو لم تعد متاحة." });
        }

        // Return only non-sensitive info
        res.json({ 
            success: true, 
            case: {
                id: row.id,
                age: row.age,
                gender: row.gender,
                district: row.district,
                problems: row.problem ? row.problem.split(', ') : []
            }
        });
    });
});

// Confirm Claim (Student accepts case)
app.post('/api/cases/confirm-claim', (req, res) => {
    const { token, studentId, studentName } = req.body;

    db.get("SELECT * FROM cases WHERE claimToken = ?", [token], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "الرابط غير صالح" });
        
        if (row.status !== 'SENT_TO_STUDENTS') {
            return res.status(400).json({ error: "عذراً، تأخرت! الحالة تم حجزها بالفعل." });
        }

        // Atomic Update: Assign Student & Clear Token to prevent reuse
        db.run("UPDATE cases SET status = 'APPROVED_FOR_TREATMENT', assignedStudentId = ?, assignedStudent = ?, claimToken = NULL WHERE id = ?", 
            [studentId, studentName, row.id], 
            (updateErr) => {
                if (updateErr) return res.status(500).json({ error: "فشل الحفظ" });

                // Send Telegram Notification (Private to Student & Public update)
                if (bot) {
                    // Update Group Message to show "CLAIMED"
                    // Note: We can't edit the original message easily without message_id storage, 
                    // but we can post a new "Locked" message or just let the link fail for others.
                    
                    // Send Private DM
                    // We need student chat ID. Assuming we fetch student details or pass it.
                    // Ideally, lookup student chat ID from DB
                    db.get("SELECT telegramChatId FROM students WHERE id = ?", [studentId], (err, studentRow) => {
                        if (studentRow && studentRow.telegramChatId) {
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

📌 *تعليمات:* تواصل مع المريض خلال 24 ساعة.
                             `.trim();
                             bot.sendMessage(studentRow.telegramChatId, privateMessage, { parse_mode: 'Markdown' }).catch(e => console.error("DM fail", e));
                        }
                    });
                }

                res.json({ success: true, caseId: row.id });
            }
        );
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
        
        // IMPORTANT: Return Telegram Chat ID if exists, to store in session
        res.json({ success: true, student: row });
    } else {
      res.json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
