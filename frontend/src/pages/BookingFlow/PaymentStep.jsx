import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService, paymentService } from '../../services/api';

const PaymentStep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.booking;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Payment Form State
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  const [upiId, setUpiId] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  if (!bookingData) {
    return <div className="text-center py-12">No booking data found. Please restart your booking.</div>;
  }

  const validateCardForm = () => {
    let isValid = true;
    let errors = {};

    const cleanCard = cardData.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleanCard)) {
      errors.cardNumber = 'Card number must be exactly 16 digits.';
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
      errors.expiryDate = 'Expiry must be in MM/YY format.';
      isValid = false;
    }

    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits.';
      isValid = false;
    }

    if (cardData.cardName.trim().length < 3) {
      errors.cardName = 'Name on card is required.';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const validateUpiForm = () => {
    let isValid = true;
    let errors = {};

    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
      errors.upiId = 'Please enter a valid UPI ID (e.g. user@okicici).';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setError(null);

    // Run Validation
    if (paymentMethod === 'card' && !validateCardForm()) return;
    if (paymentMethod === 'upi' && !validateUpiForm()) return;

    setLoading(true);

    // 1. Wait for 2 seconds to simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Success Logic - Set to 100% since user complained about random failure
    const isSuccess = true;

    if (!isSuccess) {
      setError("Payment failed, please try again.");
      setLoading(false);
      return;
    }

    // 3. If Success, finalize backend operations
    try {
      const bookingResponse = await bookingService.create(bookingData);
      
      await paymentService.mockPayment({
        bookingId: bookingResponse.data._id,
        amount: bookingData.totalAmount,
        method: paymentMethod,
        status: 'success'
      });
      
      navigate(`/bookings/${bookingResponse.data._id}`);
    } catch (err) {
      console.error(err);
      if (err.message === 'Network Error' || !err.response) {
        setError('Network Error: Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError(err.response?.data?.error || 'Booking creation failed after payment. Please contact support.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h2>
          <p className="text-gray-500 mt-2">Complete your purchase to secure your tickets.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium text-center mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Order Summary */}
          <div className="bg-gray-50 p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Event</p>
                <p className="font-semibold text-gray-900">{bookingData.eventName}</p>
              </div>
              <div>
                <p className="text-gray-500">Tickets</p>
                <p className="font-semibold text-gray-900">{bookingData.numberOfTickets}x General Admission</p>
              </div>
              <div>
                <p className="text-gray-500">Attendee</p>
                <p className="font-semibold text-gray-900">{bookingData.attendeeName}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 font-medium">Total</span>
                <span className="text-3xl font-extrabold text-gray-900">₹{bookingData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="p-8 md:w-3/5">
            <div className="flex space-x-4 mb-6">
              <button 
                type="button"
                onClick={() => { setPaymentMethod('card'); setValidationErrors({}); }}
                className={`flex-1 py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Credit Card
              </button>
              <button 
                type="button"
                onClick={() => { setPaymentMethod('upi'); setValidationErrors({}); }}
                className={`flex-1 py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                UPI
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-5">
              {paymentMethod === 'card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      maxLength="16"
                      className={`w-full rounded-md shadow-sm p-3 border focus:outline-none focus:ring-1 ${validationErrors.cardNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      value={cardData.cardNumber}
                      onChange={e => setCardData({...cardData, cardNumber: e.target.value.replace(/\D/g, '')})}
                    />
                    {validationErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.cardNumber}</p>}
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className={`w-full rounded-md shadow-sm p-3 border focus:outline-none focus:ring-1 ${validationErrors.expiryDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                        value={cardData.expiryDate}
                        onChange={e => setCardData({...cardData, expiryDate: e.target.value})}
                      />
                      {validationErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{validationErrors.expiryDate}</p>}
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input 
                        type="password" 
                        placeholder="123" 
                        maxLength="4" 
                        className={`w-full rounded-md shadow-sm p-3 border focus:outline-none focus:ring-1 ${validationErrors.cvv ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                        value={cardData.cvv}
                        onChange={e => setCardData({...cardData, cvv: e.target.value})}
                      />
                      {validationErrors.cvv && <p className="text-red-500 text-xs mt-1">{validationErrors.cvv}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className={`w-full rounded-md shadow-sm p-3 border focus:outline-none focus:ring-1 ${validationErrors.cardName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                      value={cardData.cardName}
                      onChange={e => setCardData({...cardData, cardName: e.target.value})}
                    />
                    {validationErrors.cardName && <p className="text-red-500 text-xs mt-1">{validationErrors.cardName}</p>}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input 
                    type="text" 
                    placeholder="username@upi" 
                    className={`w-full rounded-md shadow-sm p-3 border focus:outline-none focus:ring-1 ${validationErrors.upiId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                  {validationErrors.upiId && <p className="text-red-500 text-xs mt-1">{validationErrors.upiId}</p>}
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-75 disabled:cursor-wait relative overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing payment...
                    </span>
                  ) : (
                    `Pay ₹${bookingData.totalAmount.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6 bg-gray-100 p-3 rounded-lg border border-gray-200">
          <strong>Note:</strong> Test/Demo payment mode — no real transaction is processed.
        </p>
      </div>
    </div>
  );
};

export default PaymentStep;
