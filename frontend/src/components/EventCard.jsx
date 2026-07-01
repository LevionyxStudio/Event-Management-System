import { useState } from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const { _id, title, date, time, venue, ticketPrice, availableSeats, imageUrl, category } = event;
  const [imgError, setImgError] = useState(false);

  const eventDate = date ? new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'TBA';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-48 w-full bg-gray-200">
        {imageUrl && !imgError ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
            onError={() => setImgError(true)} 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
            <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          {category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
        </div>
        
        <div className="space-y-2 mb-4 flex-grow">
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {eventDate} at {time}
          </p>
          <p className="text-sm text-gray-600 flex items-center line-clamp-1">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {venue}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{ticketPrice}</p>
            <p className={`text-xs font-medium ${availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {availableSeats > 0 ? `${availableSeats} seats left` : 'Sold Out'}
            </p>
          </div>
          <Link to={`/events/${_id}`} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
