const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: 'Event date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    maxlength: [200, 'Venue cannot be more than 200 characters']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats are required'],
    min: [1, 'Total seats must be at least 1'],
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats are required'],
    min: [0, 'Available seats cannot be negative'],
  },
  ticketPrice: {
    type: Number,
    required: [true, 'Ticket price is required'],
    min: [0, 'Ticket price cannot be negative'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerName: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true,
    maxlength: [100, 'Organizer name cannot be more than 100 characters']
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Event', eventSchema);
