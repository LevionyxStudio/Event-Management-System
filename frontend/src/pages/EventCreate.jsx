import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EventCreate = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    totalSeats: '',
    availableSeats: '',
    ticketPrice: '',
    imageUrl: '',
    organizerName: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      eventService.getById(id)
        .then(res => {
          const event = res.data;
          const formattedDate = new Date(event.date).toISOString().split('T')[0];
          setFormData({
            ...event,
            date: formattedDate
          });
        })
        .catch(err => {
          console.error(err);
          setServerError('Failed to fetch event data.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const validateField = (name, value) => {
    let errorMsg = '';
    
    switch (name) {
      case 'title':
      case 'description':
      case 'category':
      case 'venue':
      case 'organizerName':
      case 'time':
        if (!value || value.toString().trim() === '') {
          errorMsg = 'This field is required.';
        }
        break;
      case 'date':
        if (!value) {
          errorMsg = 'Date is required.';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of today
          if (selectedDate < today) {
            errorMsg = 'Date cannot be in the past.';
          }
        }
        break;
      case 'totalSeats':
        const seats = parseInt(value, 10);
        if (!value || isNaN(seats) || seats < 1) {
          errorMsg = 'Total seats must be a positive integer (min 1).';
        }
        break;
      case 'ticketPrice':
        const price = parseFloat(value);
        if (value === '' || isNaN(price) || price < 0) {
          errorMsg = 'Ticket price cannot be negative.';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = () => {
    // Check for any explicit error messages
    if (Object.values(errors).some(err => err !== '')) return false;
    
    // Check that required fields are not empty
    const requiredFields = ['title', 'description', 'category', 'date', 'time', 'venue', 'totalSeats', 'ticketPrice', 'organizerName'];
    if (requiredFields.some(field => !formData[field] && formData[field] !== 0)) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSaving(true);
    setServerError(null);
    try {
      if (isEditMode) {
        await eventService.update(id, formData);
      } else {
        await eventService.create({
          ...formData,
          availableSeats: formData.totalSeats 
        });
      }
      navigate('/events/manage');
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.error || 'An error occurred while saving the event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-blue-100 mt-2">
            {isEditMode ? 'Update the details for this event.' : 'Fill out the form below to publish a new event.'}
          </p>
        </div>

        <div className="p-8">
          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required name="description" rows="3" value={formData.description} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select required name="category" value={formData.category} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select a category</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Business">Business</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name *</label>
                <input required type="text" name="organizerName" value={formData.organizerName} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.organizerName ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.organizerName && <p className="mt-1 text-sm text-red-500">{errors.organizerName}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input required type="time" name="time" value={formData.time} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
              </div>

              {/* Venue */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                <input required type="text" name="venue" value={formData.venue} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.venue ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.venue && <p className="mt-1 text-sm text-red-500">{errors.venue}</p>}
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats *</label>
                <input required type="number" min="1" name="totalSeats" value={formData.totalSeats} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.totalSeats ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.totalSeats && <p className="mt-1 text-sm text-red-500">{errors.totalSeats}</p>}
              </div>

              {/* Ticket Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (₹) *</label>
                <input required type="number" min="0" step="0.01" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} className={`w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border ${errors.ticketPrice ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.ticketPrice && <p className="mt-1 text-sm text-red-500">{errors.ticketPrice}</p>}
              </div>

              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats *</label>
                  <input required type="number" min="0" name="availableSeats" value={formData.availableSeats} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                </div>
              )}

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" placeholder="https://example.com/image.jpg" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border" />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                type="button" 
                onClick={() => navigate('/events/manage')} 
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-4"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving || !isFormValid()}
                className={`bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-6 text-sm font-medium text-white transition-all ${
                  saving || !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventCreate;
