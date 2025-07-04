
const express = require('express');
const app = express();
const loggerMiddleware = require('./loggerMiddleware');
const shortUrlsRouter = require('./routes/shorturls');
const { getShortUrl, recordClick } = require('./utils/storage');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggerMiddleware);


app.get('/:shortcode', (req, res) => {
  const shortcode = req.params.shortcode;

  const entry = getShortUrl(shortcode);
  const now = new Date();

  if (!entry) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  if (entry.expiry <= now) {
    return res.status(410).json({ error: 'Short link has expired.' });
  }

  // Log click data
  const clickData = {
    timestamp: new Date().toISOString(),
    referrer: req.get('Referrer') || 'unknown',
    geo: req.headers['x-forwarded-for'] || req.ip || 'unknown'
  };
  recordClick(shortcode, clickData);

  // Redirect to original URL
  return res.redirect(entry.originalUrl);
});

// API Routes
app.use('/shorturls', shortUrlsRouter);

// Global error handler (fallback)
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log("port is working ")
});
