const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  method: {
    type: String,
    enum: {
      values: ['card', 'upi', 'netbanking'],
      message: '{VALUE} is not a valid payment method'
    },
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'success', 'failed'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Payment', paymentSchema);
