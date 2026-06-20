const Jimp = require('jimp');
const jsQR = require('jsqr');

/**
 * P1a + P1b: decodeQR(imagePath)
 * Loads an image, extracts raw pixel data, and decodes any QR code in it.
 */
async function decodeQR(imagePath) {
  const image = await Jimp.read(imagePath);
  const { data, width, height } = image.bitmap;

  const result = jsQR(new Uint8ClampedArray(data), width, height);

  if (!result) {
    throw new Error('No QR code found');
  }

  return result.data;
}

// P1c: standalone test — only runs when this file is executed directly,
// not when it's required by bot.js
if (require.main === module) {
  const testImagePath = process.argv[2] || './test-qr.png';

  decodeQR(testImagePath)
    .then((data) => console.log('Decoded QR data:', data))
    .catch((err) => console.error('Error:', err.message));
}

module.exports = decodeQR;
