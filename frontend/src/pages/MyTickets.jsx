import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bookingService.getMyBookings()
      .then(res => setBookings(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load your tickets.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Tickets</h1>
        
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-gray-500">You haven't booked any tickets yet.</p>
            <Link to="/events" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Link 
                to={`/bookings/${booking._id}`} 
                key={booking._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col transition-shadow duration-200"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wide">
                      {booking.paymentStatus === 'success' ? 'Confirmed' : booking.paymentStatus}
                    </span>
                    <span className="text-gray-500 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.eventId.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-1">{booking.eventId.venue}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tickets</p>
                      <p className="font-bold text-gray-900">{booking.numberOfTickets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="font-bold text-gray-900">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between group">
                  <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700">View QR Ticket</span>
                  <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
