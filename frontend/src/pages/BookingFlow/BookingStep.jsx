import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { eventService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookingStep = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    attendeeName: user?.name || '',
    attendeeEmail: user?.email || '',
    attendeePhone: '',
    countryCode: '+91',
    numberOfTickets: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    eventService.getById(id)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  const validateField = (name, value) => {
    let errorMsg = '';
    
    switch (name) {
      case 'attendeeName':
        if (value.trim().length < 2) {
          errorMsg = 'Name must be at least 2 characters.';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMsg = 'Name cannot contain numbers or special characters.';
        }
        break;
      case 'attendeeEmail':
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          errorMsg = 'Please enter a valid email address.';
        }
        break;
      case 'attendeePhone':
        // Determine required length based on country code
        let reqLength = 15;
        if (formData.countryCode === '+91' || formData.countryCode === '+1') reqLength = 10;
        else if (formData.countryCode === '+44') reqLength = 10; // Allowing 10 for UK as simplified rule
        else if (formData.countryCode === '+61' || formData.countryCode === '+971') reqLength = 9;
        else if (formData.countryCode === '+65') reqLength = 8;
        
        if (value.length !== reqLength) {
          errorMsg = `Phone number must be exactly ${reqLength} digits for ${formData.countryCode}.`;
        }
        break;
      case 'numberOfTickets':
        const tickets = parseInt(value, 10);
        if (isNaN(tickets) || tickets < 1) {
          errorMsg = 'Must book at least 1 ticket.';
        } else if (event && tickets > event.availableSeats) {
          errorMsg = `Only ${event.availableSeats} seats available.`;
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const getMaxLengthForCountry = (code) => {
    switch (code) {
      case '+91': return 10;
      case '+1': return 10;
      case '+44': return 11;
      case '+61': return 9;
      case '+971': return 9;
      case '+65': return 8;
      default: return 15;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'attendeePhone') {
      // Block letters/symbols completely while typing
      const digitsOnly = value.replace(/\D/g, '');
      const maxDigits = getMaxLengthForCountry(formData.countryCode);
      
      if (digitsOnly.length <= maxDigits) {
        setFormData(prev => ({ ...prev, attendeePhone: digitsOnly }));
        validateField(name, digitsOnly);
      }
    } else if (name === 'countryCode') {
      setFormData(prev => ({ ...prev, countryCode: value, attendeePhone: '' }));
      setErrors(prev => ({ ...prev, attendeePhone: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const isFormValid = () => {
    // Check if any errors exist
    if (Object.values(errors).some(err => err !== '')) return false;
    
    // Check if required fields are filled
    if (!formData.attendeeName.trim() || !formData.attendeeEmail.trim() || !formData.attendeePhone) return false;
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    if (formData.numberOfTickets > event.availableSeats) {
      setErrors(prev => ({ ...prev, numberOfTickets: `Only ${event.availableSeats} seats left!` }));
      return;
    }

    const bookingContext = {
      ...formData,
      attendeePhone: `${formData.countryCode} ${formData.attendeePhone}`,
      eventId: event._id,
      totalAmount: event.ticketPrice * formData.numberOfTickets,
      eventName: event.title
    };

    navigate('/checkout', { state: { booking: bookingContext } });
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="text-center py-12">Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Complete your booking</h2>
        <p className="text-gray-500 mb-8">You are booking tickets for <span className="font-semibold text-blue-600">{event.title}</span></p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              required 
              type="text" 
              name="attendeeName" 
              value={formData.attendeeName} 
              readOnly
              className="w-full rounded-md shadow-sm p-3 border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              required 
              type="email" 
              name="attendeeEmail" 
              value={formData.attendeeEmail} 
              readOnly
              className="w-full rounded-md shadow-sm p-3 border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className={`flex rounded-md shadow-sm border overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 ${errors.attendeePhone ? 'border-red-500' : 'border-gray-300'}`}>
              <select 
                name="countryCode" 
                value={formData.countryCode} 
                onChange={handleChange}
                className="bg-gray-50 text-gray-700 border-r border-gray-300 px-3 py-3 focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
              </select>
              <input 
                required 
                type="tel" 
                name="attendeePhone" 
                value={formData.attendeePhone} 
                onChange={handleChange} 
                className="flex-1 p-3 focus:outline-none w-full" 
                placeholder="Phone number" 
              />
            </div>
            {errors.attendeePhone && <p className="mt-1 text-sm text-red-500">{errors.attendeePhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tickets</label>
            <input 
              required 
              type="number" 
              min="1" 
              name="numberOfTickets" 
              value={formData.numberOfTickets} 
              onChange={handleChange} 
              className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border ${errors.numberOfTickets ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {errors.numberOfTickets ? (
              <p className="mt-1 text-sm text-red-500">{errors.numberOfTickets}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">{event.availableSeats} seats remaining</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-8 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              ₹{(event.ticketPrice * formData.numberOfTickets).toFixed(2)}
            </span>
          </div>

          <div className="pt-4 flex space-x-4">
            <button type="button" onClick={() => navigate(-1)} className="w-1/3 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50">
              Back
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid()}
              className={`w-2/3 flex justify-center py-3 border border-transparent text-lg font-bold rounded-xl text-white shadow-md transition-all ${
                !isFormValid() ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingStep;
