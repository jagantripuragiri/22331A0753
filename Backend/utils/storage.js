// utils/storage.js

/**
 * In-memory storage with expiry cleanup for short URLs and clicks
 */

const shortUrls = new Map(); // key: shortcode, value: { originalUrl, expiry, createdAt, clicks: [] }

function saveShortUrl(shortcode, originalUrl, expiry) {
  const createdAt = new Date();
  shortUrls.set(shortcode, {
    originalUrl,
    expiry,
    createdAt,
    clicks: []
  });
}

function getShortUrl(shortcode) {
  return shortUrls.get(shortcode);
}

function shortcodeExists(shortcode) {
  return shortUrls.has(shortcode);
}

// Save click data for shortcode
function recordClick(shortcode, clickData) {
  const entry = shortUrls.get(shortcode);
  if (entry) {
    entry.clicks.push(clickData);
  }
}

// Remove expired shortcodes
function cleanupExpired() {
  const now = new Date();
  for (const [key, value] of shortUrls.entries()) {
    if (value.expiry <= now) {
      shortUrls.delete(key);
    }
  }
}

// Periodic cleanup every 5 minutes
setInterval(cleanupExpired, 5 * 60 * 1000);

module.exports = {
  saveShortUrl,
  getShortUrl,
  shortcodeExists,
  recordClick,
};
