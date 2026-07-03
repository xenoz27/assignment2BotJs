require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const os = require('os');
const path = require('path');

const decodeQR = require('./qr');
const { extractRollNumber, isRegistered } = require('./parser');
const { markPresent, getStats } = require('./attendance');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN not found. Add it to your .env file (see .env.example).');
  process.exit(1);
}

// P4a: Setup — polling mode
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome! Send a photo of your IITK ID card QR code to mark attendance.\n\nCommands:\n/report — see who has been marked present\n/export — download attendance as CSV'
  );
});

// P4b + P4c: Photo handler with error handling
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Highest-resolution photo is the last item in msg.photo
    const photo = msg.photo[msg.photo.length - 1];
    const filePath = await bot.downloadFile(photo.file_id, os.tmpdir());

    const qrString = await decodeQR(filePath);
    const rollNumber = extractRollNumber(qrString);

    if (!rollNumber) {
      bot.sendMessage(chatId, 'No valid roll number found in that QR code.');
      return;
    }

    if (!isRegistered(rollNumber)) {
      bot.sendMessage(chatId, `Roll number ${rollNumber} is out of the registered range (240001–240400).`);
      return;
    }

    const result = markPresent(rollNumber);

    if (result.success) {
      bot.sendMessage(chatId, `✅ Attendance marked for ${rollNumber}.`);
    } else if (result.reason === 'already_marked') {
      bot.sendMessage(chatId, `${rollNumber} was already marked present at ${result.timestamp}.`);
    }
  } catch (err) {
    if (err.message === 'No QR code found') {
      bot.sendMessage(chatId, 'No QR code detected in that image. Try a clearer, well-lit photo.');
    } else {
      console.error(err);
      bot.sendMessage(chatId, 'Something went wrong processing that image.');
    }
  }
});

// P4d: /report
bot.onText(/\/report/, (msg) => {
  const { total, rollNumbers } = getStats();
  const list = rollNumbers.length ? rollNumbers.join('\n') : 'No attendance marked yet.';
  bot.sendMessage(msg.chat.id, `Total present: ${total}\n\n${list}`);
});

// BONUS: /export — CSV built manually, no library
bot.onText(/\/export/, (msg) => {
  const chatId = msg.chat.id;

  let storeData;
  try {
    storeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'attendance.json'), 'utf8'));
  } catch (err) {
    storeData = {};
  }

  const rollNumbers = Object.keys(storeData).sort();

  if (!rollNumbers.length) {
    bot.sendMessage(chatId, 'No attendance data to export yet.');
    return;
  }

  const rows = [['RollNumber', 'Timestamp'], ...rollNumbers.map((rn) => [rn, storeData[rn]])];
  const csv = rows.map((r) => r.join(',')).join('\n');

  const tempPath = path.join(os.tmpdir(), `attendance-${Date.now()}.csv`);
  fs.writeFileSync(tempPath, csv);

  bot.sendDocument(chatId, tempPath).then(() => {
    fs.unlinkSync(tempPath);
  });
});

console.log('Bot is running...');
