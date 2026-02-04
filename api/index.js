// api/index.js
const express = require('express');
const cors = require('cors');
const { sql } = require('@vercel/postgres'); // Replaces sqlite3
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

const app = express();

// --- CONFIGURATION ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_GROUP_ID = process.env.GROUP_ID;
// Vercel automatically provides process.env.POSTGRES_URL when you link a database

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- TELEGRAM BOT SETUP (WEBHOOK MODE) ---
// We do NOT use polling: true
const bot = new TelegramBot(TELEGRAM_TOKEN); 
// We will receive updates via a POST route from Telegram

// --- DATABASE INIT ---
// You should run this manually or via a separate script, 
// but for simplicity we check table existence here (not recommended for production perf)
async function initDB() {
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
}

// --- API ENDPOINTS ---

// 1. Telegram Webhook Listener
// You must set the webhook url manually once: 
// https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://<YOUR_VERCEL_URL>/api/telegram
app.post('/api/telegram', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle "Claim Case" button clicks (Logic moved inside webhook handler)
bot.on('callback_query', async (query) => {
  // ... (Your existing logic, but using await sql`` instead of db.run) ...
  // Example adaptation:
  const caseId = query.data.split('_')[1];
  const studentUsername = `@${query.from.username}`;
  
  // Update DB logic for Postgres
  // await sql`UPDATE cases SET status = 'WAITING...' WHERE id = ${caseId}`;
  
  // Send responses
  bot.answerCallbackQuery(query.id, { text: "✅ تم تسجيل طلبك!" });
});

// 2. Submit Case
app.post('/api/submit', async (req, res) => {
  const data = req.body;
  await initDB(); // Ensure table exists

  try {
    const medicalHistoryStr = data.medicalHistory ? data.medicalHistory.join(', ') : '';
    const problemsStr = data.problems.join(', ');

    // Postgres Insert
    await sql`INSERT INTO cases (id, fullName, phone, age, gender, district, problem, medicalHistory, notes, submissionDate) 
              VALUES (${data.id}, ${data.fullName}, ${data.phone}, ${data.age}, ${data.gender}, ${data.district}, ${problemsStr}, ${medicalHistoryStr}, ${data.additionalNotes}, ${data.submissionDate})`;

    // Send Telegram Msg
    const message = `📢 *حالة جديدة* ... (Your message logic) ...`;
    bot.sendMessage(TELEGRAM_GROUP_ID, message, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: "✋ طلب استلام", callback_data: `claim_${data.id}` }]] }
    });

    res.json({ success: true, id: data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Get Cases
app.get('/api/cases', async (req, res) => {
  await initDB();
  const { rows } = await sql`SELECT * FROM cases ORDER BY submissionDate DESC`;
  res.json({ cases: rows });
});

// 4. Approve Assignment
app.post('/api/approve-assignment', async (req, res) => {
  const { caseId } = req.body;
  // ... Logic converted to await sql`` ...
  res.json({ success: true });
});

// Export the app for Vercel
module.exports = app;
