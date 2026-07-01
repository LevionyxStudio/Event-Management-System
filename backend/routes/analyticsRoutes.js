const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOverview,
  getSalesTrend,
  getCategoryBreakdown,
  getTopEvents,
  getEventAnalytics
} = require('../controllers/analyticsController');

// All analytics routes require authentication
router.use(protect);

router.get('/overview', getOverview);
router.get('/sales-trend', getSalesTrend);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/top-events', getTopEvents);
router.get('/event/:eventId', getEventAnalytics);

module.exports = router;
