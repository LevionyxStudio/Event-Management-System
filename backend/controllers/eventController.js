const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { category, upcoming } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Public
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user._id
    };
    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get organizer's events
// @route   GET /api/events/my
// @access  Private/Organizer
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Organizer
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Make sure user is event owner
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updateData = { ...req.body };
    delete updateData.organizerId; // Prevent transferring ownership maliciously

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Make sure user is event owner
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ eventId: req.params.id }); // Clean up orphaned bookings

    res.status(200).json({ message: 'Event removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
