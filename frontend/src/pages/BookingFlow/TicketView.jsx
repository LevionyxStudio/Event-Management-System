import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const TicketView = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bookingService.getById(id)
      .then(res => setBooking(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to load your ticket.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-500 font-bold">{error}</div>;
  if (!booking) return <div className="text-center py-12">Ticket not found</div>;

  const event = booking.eventId;
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200">
        
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center text-white relative">
           {/* Perforated edge effect using radial gradients */}
           <div className="absolute -bottom-3 left-0 w-full flex justify-between px-2">
             <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
             <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
           </div>
           
           <div className="mb-2 uppercase tracking-widest text-blue-200 text-sm font-bold">Admit {booking.numberOfTickets}</div>
           <h1 className="text-3xl font-extrabold mb-1 leading-tight">{event.title}</h1>
           <p className="text-blue-100 font-medium">{event.category}</p>
        </div>

        {/* Ticket Body */}
        <div className="p-8 border-b-2 border-dashed border-gray-200 relative">
          
          <div className="space-y-5 mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Date & Time</p>
              <p className="text-gray-900 font-bold text-lg">{eventDate}</p>
              <p className="text-gray-600 font-medium">{event.time}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Location</p>
              <p className="text-gray-900 font-bold">{event.venue}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Attendee</p>
              <p className="text-gray-900 font-bold">{booking.attendeeName}</p>
              <p className="text-gray-500 text-sm">{booking.attendeeEmail}</p>
            </div>
          </div>

          <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
             {booking.qrCode ? (
               <img src={booking.qrCode} alt="Ticket QR Code" className="w-48 h-48 mix-blend-multiply" />
             ) : (
               <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-lg">No QR Code</div>
             )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3 font-mono">ID: {booking._id}</p>
        </div>

        {/* Ticket Footer */}
        <div className="bg-gray-50 px-6 py-6 text-center">
          <Link to="/events" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
            Browse More Events &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TicketView;
