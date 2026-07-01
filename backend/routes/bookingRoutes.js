const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getBooking,
  getEventBookings,
  getMyBookings
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/event/:eventId', protect, getEventBookings);
router.get('/:id', protect, getBooking);

module.exports = router;
