
const shortUrls = new Map();

function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createShortUrl(originalUrl, expiry) {
  const shortcode = generateShortcode();

  const expiresAt = expiry ? new Date(expiry) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days

  shortUrls.set(shortcode, {
    originalUrl,
    expiry: expiresAt,
    clicks: []
  });

  return {
    shortUrl: `http://localhost:3000/${shortcode}`,
    expiry: expiresAt
     
  };
}


function getShortUrl(code) {
  return shortUrls.get(code);
}

function recordClick(code, data) {
  const entry = shortUrls.get(code);
  if (entry) {
    entry.clicks.push(data);
  }
}

module.exports = {
  createShortUrl,
  getShortUrl,
  recordClick
};
