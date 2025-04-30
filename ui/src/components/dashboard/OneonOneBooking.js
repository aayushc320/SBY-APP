import { useState, useEffect, useCallback } from 'react';
// Commented out as it's only used in commented code blocks
// import axios from 'axios';

// Mock instructors data for development
const mockInstructors = [
  {
    _id: '1',
    name: 'Emma Wilson',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    specialties: ['Hatha Yoga', 'Meditation', 'Yin Yoga'],
    rating: 4.9,
    sessionCreditCost: 2,
    workWeekends: false
  },
  {
    _id: '2',
    name: 'James Rodriguez',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    specialties: ['Power Yoga', 'Vinyasa Flow', 'Strength Training'],
    rating: 4.7,
    sessionCreditCost: 3,
    workWeekends: true
  },
  {
    _id: '3',
    name: 'Sarah Chen',
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    specialties: ['Prenatal Yoga', 'Restorative Yoga', 'Yoga Therapy'],
    rating: 5.0,
    sessionCreditCost: 4,
    workWeekends: true
  },
  {
    _id: '4',
    name: 'Michael Brown',
    profileImage: 'https://randomuser.me/api/portraits/men/46.jpg',
    specialties: ['Ashtanga Yoga', 'Fitness Coaching', 'Meditation'],
    rating: 4.8,
    sessionCreditCost: 3,
    workWeekends: false
  }
];

// Mock available times
const generateAvailableTimes = () => {
  const times = [];
  // Generate times from 7am to 7pm
  for (let hour = 7; hour <= 19; hour++) {
    if (Math.random() > 0.5) { // Randomly include some time slots
      times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    if (Math.random() > 0.7) { // Even fewer slots for half hours
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return times;
};

const OneonOneBooking = ({ setAlert, membershipInfo }) => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch all instructors who offer 1-on-1 sessions
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // Uncomment the below code when the real API is ready
        /*
        const res = await axios.get('/api/instructors/one-on-one');
        setInstructors(res.data.data);
        setLoading(false);
        */

        // Mock data for development
        setTimeout(() => {
          setInstructors(mockInstructors);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setAlert({
          type: 'error',
          message: 'Failed to load instructors. Please try again later.'
        });
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [setAlert]);

  // Fetch available times for the selected instructor and date
  const fetchAvailableTimes = useCallback(async () => {
    if (!selectedInstructor || !selectedDate) return;

    try {
      setLoading(true);
      // Uncomment the below code when the real API is ready
      /*
      const res = await axios.get(`/api/instructors/${selectedInstructor._id}/availability`, {
        params: { date: selectedDate, sessionType: 'oneOnOne' }
      });
      setAvailableTimes(res.data.data);
      setLoading(false);
      */

      // Mock data for development
      setTimeout(() => {
        setAvailableTimes(generateAvailableTimes());
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching available times:', err);
      setAlert({
        type: 'error',
        message: 'Failed to load available times. Please try again later.'
      });
      setLoading(false);
    }
  }, [selectedInstructor, selectedDate, setAlert]);

  // When instructor or date changes, fetch available times
  useEffect(() => {
    if (selectedInstructor && selectedDate) {
      fetchAvailableTimes();
    }
  }, [selectedInstructor, selectedDate, fetchAvailableTimes]);

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
    setSelectedTime(''); // Reset selected time when instructor changes
    setAvailableTimes([]);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Reset selected time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookSession = async () => {
    if (!selectedInstructor || !selectedDate || !selectedTime) {
      setAlert({
        type: 'error',
        message: 'Please select an instructor, date, and time'
      });
      return;
    }

    try {
      // Uncomment the below code when the real API is ready
      /*
      const res = await axios.post('/api/bookings', {
        instructorId: selectedInstructor._id,
        sessionDate: selectedDate,
        sessionTime: selectedTime,
        sessionType: 'oneOnOne'
      });

      if (res.data.success) {
        setAlert({
          type: 'success',
          message: 'Your 1-on-1 session has been booked successfully!'
        });
        
        // Reset form
        setSelectedInstructor(null);
        setSelectedDate('');
        setSelectedTime('');
        setShowConfirmModal(false);
        
        // Redirect to upcoming classes tab
        document.getElementById('tabButton_upcoming').click();
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to book session'
        });
      }
      */

      // Mock booking for development
      setTimeout(() => {
        setAlert({
          type: 'success',
          message: 'Your 1-on-1 session has been booked successfully!'
        });
        
        // Reset form
        setSelectedInstructor(null);
        setSelectedDate('');
        setSelectedTime('');
        setShowConfirmModal(false);
        
        // Redirect to upcoming classes tab
        document.getElementById('tabButton_upcoming').click();
      }, 1000);
    } catch (err) {
      console.error('Error booking session:', err);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Something went wrong. Please try again.'
      });
    }
  };

  // Generate available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Skip weekends if instructor doesn't work on weekends
      if (selectedInstructor && !selectedInstructor.workWeekends) {
        const day = date.getDay();
        if (day === 0 || day === 6) continue; // Skip Sunday (0) and Saturday (6)
      }
      
      const formattedDate = date.toISOString().split('T')[0];
      dates.push(formattedDate);
    }
    
    return dates;
  };

  // Format time string (e.g., "14:00" to "2:00 PM")
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert to 12-hour format
    return `${hour}:${minutes} ${ampm}`;
  };

  // Check if user has enough credits
  const hasEnoughCredits = () => {
    if (!membershipInfo) return false;
    
    // Check if user has unlimited sessions in their plan
    if (membershipInfo.unlimitedOneOnOne) return true;
    
    // Otherwise check credit balance
    return membershipInfo.credits >= (selectedInstructor?.sessionCreditCost || 1);
  };

  if (loading && instructors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Book a 1-on-1 Session</h2>
      
      {/* Credit Information */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Your Credit Information</h3>
        <div className="flex justify-between">
          <p className="text-gray-700">
            Available Credits: <span className="font-semibold">{membershipInfo?.credits || 0}</span>
          </p>
          {membershipInfo?.unlimitedOneOnOne && (
            <p className="text-indigo-600 font-semibold">Unlimited 1-on-1 Sessions Included</p>
          )}
        </div>
      </div>
      
      {/* Instructor Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select an Instructor</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <div 
              key={instructor._id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedInstructor?._id === instructor._id 
                  ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => handleInstructorSelect(instructor)}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src={instructor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=6366F1&color=fff&size=200`} 
                  alt={instructor.name}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold">{instructor.name}</h4>
                <p className="text-gray-500 text-sm mb-2">{instructor.specialties.join(', ')}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < Math.floor(instructor.rating) ? 'text-yellow-500' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">{instructor.rating}</span>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">
                    {instructor.sessionCreditCost} {instructor.sessionCreditCost === 1 ? 'credit' : 'credits'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedInstructor && (
        <>
          {/* Booking Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date & Time</h3>
            
            {/* Date Selection */}
            <div className="mb-4">
              <label htmlFor="session-date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <select
                id="session-date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedDate}
                onChange={handleDateChange}
              >
                <option value="">Select a date</option>
                {getAvailableDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Times
                </label>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-1 text-sm text-gray-500">Loading available times...</p>
                  </div>
                ) : availableTimes.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`py-2 px-4 text-center text-sm rounded-md ${
                          selectedTime === time
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No available times for this date. Please select another date.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Booking Action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={!selectedTime || !hasEnoughCredits()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Book Session
            </button>
          </div>
          
          {!hasEnoughCredits() && selectedInstructor && (
            <p className="mt-2 text-sm text-red-600 text-right">
              You don't have enough credits for this session. This instructor requires {selectedInstructor.sessionCreditCost} credits.
            </p>
          )}
        </>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Booking</h3>
            <p className="text-gray-700 mb-4">
              You are about to book a 1-on-1 session with <strong>{selectedInstructor.name}</strong> on{' '}
              <strong>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at{' '}
              <strong>{formatTime(selectedTime)}</strong>.
            </p>
            <p className="text-gray-700 mb-6">
              This will use <strong>{selectedInstructor.sessionCreditCost}</strong> credits from your account.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleBookSession}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneonOneBooking; 