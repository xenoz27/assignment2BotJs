# QR Attendance Bot

A Telegram bot that marks student attendance by scanning the QR code on an
IITK ID card. Students send a photo of their card; the bot decodes the QR
code, pulls out the roll number, checks it's registered (240001–240400),
and marks them present — once.

## What it does

1. `/start` — greets the user and lists commands.
2. Send a **photo** of an ID card — the bot decodes the QR code, extracts the
   roll number, and marks attendance. Replies differently if the photo has
   no QR code, no valid roll number, an out-of-range roll number, or has
   already been marked present (shows the original timestamp).
3. `/report` — replies with the total count and full list of roll numbers
   marked present so far.
4. `/export` — builds a CSV (`RollNumber,Timestamp`) from the attendance
   store and sends it as a downloadable file.

## Project structure

- `qr.js` — decodes a QR code from an image file (jimp + jsqr)
- `parser.js` — extracts and validates the roll number from the raw QR string
- `attendance.js` — file-based attendance store (`attendance.json`)
- `bot.js` — wires everything together via the Telegram Bot API

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram:
   `/newbot` → copy the token it gives you.
3. Copy `.env.example` to `.env` and paste your token in:
   ```
   cp .env.example .env
   ```
   ```
   BOT_TOKEN=your_actual_token_here
   ```
4. **Before running:** open `parser.js` and replace the placeholder comment
   at the top with your own ID card's raw QR string (scan it with any QR
   reader app) and note where the roll number sits in it.

## Running

```
node bot.js
```

The bot starts in polling mode. Message it on Telegram to test.

## Testing qr.js standalone

```
node qr.js path/to/test-image.png
```

This runs `decodeQR()` directly and logs the decoded string, without
touching the bot.

## Notes

- `attendance.json` is created automatically on first `markPresent()` call —
  don't commit it.
- `.env` and `node_modules` are gitignored — don't commit them either.
