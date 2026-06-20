const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'attendance.json');

// P3a: Init store — read attendance.json on require, start fresh if missing
let store = {};
try {
  store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
} catch (err) {
  store = {};
}

/**
 * P3b: markPresent(rollNumber)
 * Marks a roll number present once. If already marked, returns the
 * original timestamp instead of overwriting it.
 */
function markPresent(rollNumber) {
  if (store[rollNumber]) {
    return {
      success: false,
      reason: 'already_marked',
      timestamp: store[rollNumber],
    };
  }

  const timestamp = new Date().toISOString();
  store[rollNumber] = timestamp;
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));

  return { success: true };
}

/**
 * P3c: getStats()
 * Returns total count and a sorted list of roll numbers marked present.
 */
function getStats() {
  const rollNumbers = Object.keys(store).sort();
  return {
    total: rollNumbers.length,
    rollNumbers,
  };
}

module.exports = { markPresent, getStats };
