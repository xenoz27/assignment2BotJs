/**
 * P2a: RAW QR STRING FROM MY IITK ID CARD
 * -----------------------------------------------------------------------
 * ⚠️ REPLACE THIS BEFORE SUBMITTING — this is a placeholder, not a real
 * scanned string. Scan your own card with any QR reader app, paste the
 * exact raw output below, and describe where the roll number sits in it.
 *
 * "<PASTE YOUR RAW QR STRING HERE>"
 *
 * Roll number location: <describe it here, e.g. "the 6-digit number right
 * after the colon" or "the third field in a semicolon-separated string">
 * -----------------------------------------------------------------------
 */

/**
 * P2b: extractRollNumber(qrString)
 * Finds all 6-digit sequences in the string and returns the first one
 * that falls in the valid roll number range (240001–240400), or null.
 */
function extractRollNumber(qrString) {
  const matches = qrString.match(/\d{6}/g);
  if (!matches) return null;

  const found = matches.find((num) => {
    const n = Number(num);
    return n >= 240001 && n <= 240400;
  });

  return found || null;
}

/**
 * P2c: isRegistered(rollNumber)
 * True if the roll number falls within the registered range, inclusive.
 */
function isRegistered(rollNumber) {
  const n = Number(rollNumber);
  return n >= 240001 && n <= 240400;
}

module.exports = { extractRollNumber, isRegistered };
