const Booking = require('../models/Booking');
const Event = require('../models/Event');
const qrcode = require('qrcode');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
  try {
    const { eventId, attendeeName, attendeeEmail, attendeePhone, numberOfTickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.availableSeats < numberOfTickets) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const totalAmount = event.ticketPrice * numberOfTickets;

    const booking = await Booking.create({
      eventId,
      userId: req.user._id,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      numberOfTickets,
      totalAmount,
      paymentStatus: 'success' // Hardcoded to success for now as we don't have stripe yet
    });

    // Generate QR Code data
    const qrData = JSON.stringify({
      bookingId: booking._id,
      eventId: booking.eventId,
      attendeeEmail: booking.attendeeEmail
    });
    
    const qrCodeImage = await qrcode.toDataURL(qrData);

    // Update booking with QR code
    booking.qrCode = qrCodeImage;
    await booking.save();

    // Decrement available seats atomically to prevent race conditions
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: event._id, availableSeats: { $gte: numberOfTickets } },
      { $inc: { availableSeats: -numberOfTickets } }
    );

    if (!updatedEvent) {
      // Rollback booking if seats were taken concurrently
      await Booking.findByIdAndDelete(booking._id);
      return res.status(400).json({ error: 'Seats were sold out during your transaction. Please try again.' });
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Public
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all bookings for an event
// @route   GET /api/bookings/event/:eventId
// @access  Private/Organizer
exports.getEventBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ eventId: req.params.eventId });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('eventId')
      .sort('-createdAt');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
