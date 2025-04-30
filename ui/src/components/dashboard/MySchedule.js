import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

// Mock data for development
const mockBookings = [
  {
    _id: 'booking1',
    classSession: {
      _id: 'session1',
      title: 'Vinyasa Flow Yoga',
      startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      endTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour later
      location: 'online',
      meetingLink: 'https://zoom.us/j/123456789?pwd=abc123'
    },
    instructor: {
      name: 'Sarah Johnson',
      email: 'sarah@strongbyyoga.com'
    },
    status: 'confirmed',
    bookedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    _id: 'booking2',
    classSession: {
      _id: 'session2',
      title: 'HIIT Circuit Training',
      startTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
      endTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 minutes later
      location: 'Studio B'
    },
    instructor: {
      name: 'Mike Chen',
      email: 'mike@strongbyyoga.com'
    },
    status: 'confirmed',
    bookedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'booking3',
    classSession: {
      _id: 'session3',
      title: 'Personal Training Session',
      startTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      endTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 minutes later
      location: 'Studio A'
    },
    instructor: {
      name: 'David Rodriguez',
      email: 'david@strongbyyoga.com'
    },
    status: 'completed',
    bookedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    completedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString() // When the class ended
  },
  {
    _id: 'booking4',
    classSession: {
      _id: 'session4',
      title: 'Gentle Restorative Yoga',
      startTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(), // 75 minutes later
      location: 'online',
      meetingLink: 'https://zoom.us/j/987654321?pwd=xyz789'
    },
    instructor: {
      name: 'Emma Taylor',
      email: 'emma@strongbyyoga.com'
    },
    status: 'confirmed',
    bookedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'booking5',
    classSession: {
      _id: 'session5',
      title: 'Pilates Core Focus',
      startTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      endTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 60 minutes later
      location: 'Studio C'
    },
    instructor: {
      name: 'Lisa Wong',
      email: 'lisa@strongbyyoga.com'
    },
    status: 'cancelled',
    bookedAt: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    cancelledAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  }
];

const MySchedule = ({ setAlert }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // When API is ready, uncomment below
        /*
        const res = await axios.get('/api/bookings/my-bookings');
        setBookings(res.data.data);
        */
        
        // Mock data for now
        setTimeout(() => {
          setBookings(mockBookings);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setAlert({
          type: 'error',
          message: 'Failed to load your bookings'
        });
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [setAlert]);
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const sessionStartTime = new Date(booking.classSession.startTime);
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return sessionStartTime > now && booking.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return sessionStartTime < now || booking.status === 'cancelled';
    }
    
    return true;
  });
  
  // Sort bookings by start time
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.classSession.startTime);
    const dateB = new Date(b.classSession.startTime);
    
    if (activeTab === 'upcoming') {
      return dateA - dateB; // Ascending for upcoming
    } else {
      return dateB - dateA; // Descending for past
    }
  });
  
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      // When API is ready, uncomment below
      /*
      const res = await axios.put(`/api/bookings/${selectedBooking._id}/cancel`, {
        reason: cancelReason
      });
      
      if (res.data.success) {
        // Update booking in state
        setBookings(prev => 
          prev.map(booking => 
            booking._id === selectedBooking._id 
              ? { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() } 
              : booking
          )
        );
        
        setAlert({
          type: 'success',
          message: 'Booking cancelled successfully'
        });
      }
      */
      
      // Mock success for now
      setTimeout(() => {
        // Update booking in state
        setBookings(prev => 
          prev.map(booking => 
            booking._id === selectedBooking._id 
              ? { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() } 
              : booking
          )
        );
        
        setAlert({
          type: 'success',
          message: 'Booking cancelled successfully'
        });
        
        // Close modal and reset
        setShowCancelModal(false);
        setSelectedBooking(null);
        setCancelReason('');
      }, 500);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setAlert({
        type: 'error',
        message: 'Failed to cancel booking'
      });
    }
  };
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEE, MMM d, yyyy');
  };
  
  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Check if a session is starting soon (within the next 15 minutes)
  const isStartingSoon = (startTimeString) => {
    const startTime = new Date(startTimeString);
    const now = new Date();
    const diffMs = startTime - now;
    const diffMinutes = diffMs / (1000 * 60);
    
    return diffMinutes > 0 && diffMinutes <= 15;
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Check if cancellation is allowed (24 hours before class)
  const canCancelBooking = (startTimeString) => {
    const startTime = new Date(startTimeString);
    const now = new Date();
    const diffMs = startTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours >= 24;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Schedule</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past & Cancelled
          </button>
        </nav>
      </div>
      
      {/* No bookings message */}
      {sortedBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">
            {activeTab === 'upcoming'
              ? 'You have no upcoming bookings. Book a class to get started!'
              : 'You have no past bookings yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map(booking => (
            <div 
              key={booking._id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="md:flex">
                <div className="p-6 md:w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.classSession.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">with {booking.instructor.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="block text-xs text-gray-500">DATE</span>
                      <span className="font-medium">{formatDate(booking.classSession.startTime)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">TIME</span>
                      <span className="font-medium">{formatTime(booking.classSession.startTime)} - {formatTime(booking.classSession.endTime)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">LOCATION</span>
                      <span className="font-medium">{booking.classSession.location}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">BOOKED ON</span>
                      <span className="font-medium">{formatDate(booking.bookedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6 space-x-3">
                    {/* Show Join button for online sessions starting soon */}
                    {booking.status === 'confirmed' && 
                     booking.classSession.location === 'online' && 
                     isStartingSoon(booking.classSession.startTime) && (
                      <a
                        href={booking.classSession.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Join Session
                      </a>
                    )}
                    
                    {/* Show Cancel button for upcoming classes if within cancellation window */}
                    {booking.status === 'confirmed' && 
                     activeTab === 'upcoming' && 
                     canCancelBooking(booking.classSession.startTime) && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {/* Show warning for late cancellation */}
                    {booking.status === 'confirmed' && 
                     activeTab === 'upcoming' && 
                     !canCancelBooking(booking.classSession.startTime) && (
                      <span className="text-sm text-yellow-600">
                        Cannot cancel within 24 hours of session
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Cancellation Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your booking for <strong>{selectedBooking.classSession.title}</strong> on{' '}
              <strong>{formatDate(selectedBooking.classSession.startTime)}</strong> at{' '}
              <strong>{formatTime(selectedBooking.classSession.startTime)}</strong>?
            </p>
            
            <div className="mb-4">
              <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for cancellation (optional)
              </label>
              <textarea
                id="cancel-reason"
                rows="3"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you're cancelling"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule; 