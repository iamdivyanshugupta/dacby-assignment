const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
} = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stories', getAllStories);
router.get('/stories/:id', getStoryById);
router.post('/stories/:id/bookmark', protect, toggleBookmark);

module.exports = router;