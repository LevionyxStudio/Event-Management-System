import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (upcomingOnly) params.upcoming = true;
      
      const response = await eventService.getAll(params);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, upcomingOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Events</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Business">Business</option>
          </select>

          <label className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-300 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              checked={upcomingOnly}
              onChange={(e) => setUpcomingOnly(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Upcoming Only</span>
          </label>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
