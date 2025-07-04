
const express = require('express');
const router = express.Router();
const { createShortUrl } = require('../utils/storage');


router.post('/', (req, res) => {
  try {
    const { originalUrl, expiry } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    const result = createShortUrl(originalUrl, expiry);
    console.log('Short URL created:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in /shorturls:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
