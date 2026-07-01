const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, createEvent);

router.route('/my')
  .get(protect, getMyEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;
