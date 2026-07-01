const express = require('express');
const router = express.Router();
const { processMockPayment } = require('../controllers/paymentController');

router.post('/mock', processMockPayment);

module.exports = router;
