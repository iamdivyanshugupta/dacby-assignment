const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const scrapeHackerNews = async () => {
  try {
    console.log('Scraping Hacker News...');

    const { data } = await axios.get('https://news.ycombinator.com');
    const $ = cheerio.load(data);

    const stories = [];

    $('.athing').slice(0, 10).each((i, el) => {
      const id = $(el).attr('id');
      const titleEl = $(el).find('.titleline > a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';

      // The score, author and time are in the NEXT sibling row
      const subtext = $(el).next().find('.subtext');
      const points = parseInt(subtext.find('.score').text()) || 0;
      const author = subtext.find('.hnuser').text().trim() || 'unknown';
      const postedAt = subtext.find('.age').attr('title') || 
                       subtext.find('.age').text().trim() || 'unknown';

      if (title) {
        stories.push({ hackerNewsId: id, title, url, points, author, postedAt });
      }
    });

    // Save to MongoDB — skip duplicates using upsert
    let savedCount = 0;
    for (const story of stories) {
      await Story.findOneAndUpdate(
        { hackerNewsId: story.hackerNewsId },
        story,
        { upsert: true, returnDocument: 'after' }
      );
      savedCount++;
    }

    console.log(`Scraping complete. ${savedCount} stories saved to MongoDB.`);
    return { success: true, count: savedCount };

  } catch (error) {
    console.error('Scraping failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { scrapeHackerNews };