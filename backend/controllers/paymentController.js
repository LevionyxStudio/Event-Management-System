const Payment = require('../models/Payment');

// @desc    Process a mock payment
// @route   POST /api/payments/mock
// @access  Public
exports.processMockPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, status } = req.body;

    // Generate a fake transaction ID
    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const payment = await Payment.create({
      bookingId,
      amount,
      method: method || 'card',
      status: status || 'success',
      transactionId
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
