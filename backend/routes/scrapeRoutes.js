const express = require('express');
const router = express.Router();
const { scrapeHackerNews } = require('../controllers/scraperController');

router.post('/scrape', async (req, res) => {
  const result = await scrapeHackerNews();
  if (result.success) {
    res.json({ message: `Scraping complete. ${result.count} stories saved.` });
  } else {
    res.status(500).json({ message: 'Scraping failed.', error: result.error });
  }
});

module.exports = router;