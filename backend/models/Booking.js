const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  attendeeName: {
    type: String,
    required: [true, 'Attendee name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name cannot contain numbers or special characters']
  },
  attendeeEmail: {
    type: String,
    required: [true, 'Attendee email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    lowercase: true,
  },
  attendeePhone: {
    type: String,
    required: [true, 'Attendee phone is required'],
    match: [/^\+\d{1,4}\s\d{7,15}$/, 'Please use a valid phone number with country code'],
    maxlength: 20
  },
  numberOfTickets: {
    type: Number,
    required: [true, 'Number of tickets is required'],
    min: [1, 'Must book at least 1 ticket']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'success', 'failed'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'pending'
  },
  qrCode: {
    type: String,
    default: ''
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Booking', bookingSchema);
