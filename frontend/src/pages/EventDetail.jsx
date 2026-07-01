import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getById(id);
        setEvent(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500 font-semibold text-lg">{error}</div>;
  if (!event) return <div className="text-center py-20 font-semibold text-lg">Event not found.</div>;

  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : 'TBA';

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-gray-900">
        {event.imageUrl && !imgError ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 opacity-30">
            <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <Link to="/events" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 font-medium transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Events
            </Link>
            
            <div className="flex items-center mb-4 space-x-4">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                {event.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              {event.title}
            </h1>
            
            <p className="text-xl text-gray-300 flex items-center font-medium">
              <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Organized by {event.organizerName}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this event</h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">When and where</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Date & Time */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Date and Time</h3>
                    <p className="text-gray-600">{eventDate}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Location</h3>
                    <p className="text-gray-600">{event.venue}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Sticky Ticket Box */}
          <div className="w-full lg:w-1/3 relative">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 z-10">
              
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Ticket Price</p>
                <p className="text-5xl font-extrabold text-gray-900">
                  {event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Total Capacity</span>
                  <span className="font-semibold text-gray-900">{event.totalSeats}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-bold ${event.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {event.availableSeats > 0 ? `${event.availableSeats} Left` : 'Sold Out'}
                  </span>
                </div>
              </div>

              {user ? (
                <button 
                  onClick={() => navigate(`/events/${event._id}/book`)}
                  disabled={event.availableSeats <= 0}
                  className={`w-full py-4 rounded-xl text-lg font-bold transition-all transform hover:-translate-y-1 ${
                    event.availableSeats > 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  {event.availableSeats > 0 ? 'Book Now' : 'Event Full'}
                </button>
              ) : (
                <button 
                  onClick={() => {
                    alert('Please log in to book tickets.');
                    navigate('/login');
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Log In to Book
                </button>
              )}

              <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Secure Booking
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
