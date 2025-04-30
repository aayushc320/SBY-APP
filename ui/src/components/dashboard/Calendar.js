import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { format } from 'date-fns';

const Calendar = ({ setAlert, membershipInfo }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // When API is ready, uncomment below
        /*
        const start = new Date();
        start.setMonth(start.getMonth() - 1); // Get data from 1 month ago
        
        const end = new Date();
        end.setMonth(end.getMonth() + 2); // Get data until 2 months ahead
        
        const res = await axios.get('/api/bookings/calendar', {
          params: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        });
        
        setEvents(res.data.data);
        */
        
        // Mock data for now
        setTimeout(() => {
          const mockEvents = generateMockCalendarEvents();
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setAlert({
          type: 'error',
          message: 'Failed to load calendar data'
        });
        setLoading(false);
      }
    };
    
    fetchCalendarData();
  }, [setAlert]);
  
  const handleEventClick = (info) => {
    // Find full event data
    const eventData = events.find(event => event.id === info.event.id);
    
    if (eventData) {
      setSelectedEvent(eventData);
      setShowEventModal(true);
    }
  };
  
  const handleBookEvent = async () => {
    if (!selectedEvent) return;
    
    // Check if already booked
    if (selectedEvent.isBooked) {
      setAlert({
        type: 'info',
        message: 'You have already booked this class'
      });
      return;
    }
    
    // Check if class is full
    if (selectedEvent.isFull) {
      setAlert({
        type: 'error',
        message: 'This class is already full'
      });
      return;
    }
    
    // Check if user has enough credits for one-on-one sessions
    if (selectedEvent.classType === 'one-on-one' && 
        !membershipInfo.unlimitedOneOnOne && 
        membershipInfo.credits < selectedEvent.creditCost) {
      setAlert({
        type: 'error',
        message: `You need ${selectedEvent.creditCost} credits to book this session`
      });
      return;
    }
    
    // Check if user has enough credits for group classes (if not unlimited)
    if (selectedEvent.classType === 'group' && 
        !membershipInfo.unlimitedGroupClasses && 
        membershipInfo.credits < selectedEvent.creditCost) {
      setAlert({
        type: 'error',
        message: `You need ${selectedEvent.creditCost} credits to book this class`
      });
      return;
    }
    
    try {
      // When API is ready, uncomment this
      /*
      const res = await axios.post('/api/bookings', {
        classSession: selectedEvent.id
      });
      
      if (res.data.success) {
        // Update the event in the calendar
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id 
              ? { 
                ...event, 
                isBooked: true,
                bookingId: res.data.data._id,
                bookingStatus: 'confirmed',
                spotsAvailable: event.spotsAvailable - 1,
                color: '#4CAF50' // Green for confirmed bookings
              } 
              : event
          )
        );
        
        setAlert({
          type: 'success',
          message: 'Class booked successfully!'
        });
      }
      */
      
      // Mock success for now
      setTimeout(() => {
        // Update the event in the calendar
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id 
              ? { 
                ...event, 
                isBooked: true,
                bookingId: `booking-${Date.now()}`,
                bookingStatus: 'confirmed',
                spotsAvailable: event.spotsAvailable - 1,
                color: '#4CAF50' // Green for confirmed bookings
              } 
              : event
          )
        );
        
        // Update the selected event
        setSelectedEvent(prev => ({
          ...prev,
          isBooked: true,
          bookingId: `booking-${Date.now()}`,
          bookingStatus: 'confirmed',
          spotsAvailable: prev.spotsAvailable - 1, 
          color: '#4CAF50'
        }));
        
        setAlert({
          type: 'success',
          message: 'Class booked successfully!'
        });
      }, 500);
    } catch (err) {
      console.error('Error booking class:', err);
      setAlert({
        type: 'error',
        message: 'Failed to book the class. Please try again.'
      });
    }
  };
  
  const handleCancelBooking = async () => {
    if (!selectedEvent || !selectedEvent.isBooked) return;
    
    try {
      // When API is ready, uncomment this
      /*
      const res = await axios.put(`/api/bookings/${selectedEvent.bookingId}/cancel`);
      
      if (res.data.success) {
        // Update the event in the calendar
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id 
              ? { 
                ...event, 
                isBooked: false,
                bookingStatus: 'cancelled',
                spotsAvailable: event.spotsAvailable + 1,
                color: event.isFull ? '#F44336' : '#2196F3' // Red if full, blue otherwise
              } 
              : event
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
        // Update the event in the calendar
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id 
              ? { 
                ...event, 
                isBooked: false,
                bookingStatus: 'cancelled',
                spotsAvailable: event.spotsAvailable + 1,
                color: event.isFull ? '#F44336' : '#2196F3' // Red if full, blue otherwise
              } 
              : event
          )
        );
        
        // Update the selected event
        setSelectedEvent(prev => ({
          ...prev,
          isBooked: false,
          bookingStatus: 'cancelled',
          spotsAvailable: prev.spotsAvailable + 1,
          color: prev.isFull ? '#F44336' : '#2196F3'
        }));
        
        setAlert({
          type: 'success',
          message: 'Booking cancelled successfully'
        });
      }, 500);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setAlert({
        type: 'error',
        message: 'Failed to cancel the booking. Please try again.'
      });
    }
  };
  
  // Generate mock calendar events for development
  const generateMockCalendarEvents = () => {
    const events = [];
    const today = new Date();
    
    // Function to create a date with specific day and hour
    const createDate = (daysFromNow, hour) => {
      const date = new Date(today);
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(hour, 0, 0, 0);
      return date;
    };
    
    // Types of classes
    const classTypes = [
      { title: 'Vinyasa Flow', type: 'group', instructor: 'Sarah Johnson', creditCost: 1 },
      { title: 'HIIT Workout', type: 'group', instructor: 'Mike Chen', creditCost: 1 },
      { title: 'Gentle Yoga', type: 'group', instructor: 'Emma Taylor', creditCost: 1 },
      { title: 'Personal Training', type: 'one-on-one', instructor: 'David Rodriguez', creditCost: 3 },
      { title: 'Meditation', type: 'group', instructor: 'Lisa Wong', creditCost: 1 },
      { title: 'Strength Training', type: 'one-on-one', instructor: 'James Wilson', creditCost: 3 }
    ];
    
    // Generate events for the next 30 days
    for (let i = 0; i < 30; i++) {
      // Skip some days randomly
      if (Math.random() > 0.7) continue;
      
      // Add 2-3 classes per day
      const numClasses = 2 + Math.floor(Math.random() * 2);
      
      for (let j = 0; j < numClasses; j++) {
        const classType = classTypes[Math.floor(Math.random() * classTypes.length)];
        const hour = 8 + Math.floor(Math.random() * 12); // Classes between 8 AM and 8 PM
        const startTime = createDate(i, hour);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (classType.type === 'one-on-one' ? 45 : 60));
        
        const spotsTotal = classType.type === 'one-on-one' ? 1 : 20;
        const spotsBooked = classType.type === 'one-on-one' ? 0 : Math.floor(Math.random() * 20);
        const spotsAvailable = spotsTotal - spotsBooked;
        const isFull = spotsAvailable <= 0;
        
        // Randomly mark some events as booked
        const isBooked = Math.random() > 0.8;
        const bookingStatus = isBooked ? (Math.random() > 0.2 ? 'confirmed' : 'pending') : null;
        
        events.push({
          id: `event-${i}-${j}`,
          title: classType.title,
          start: startTime,
          end: endTime,
          classType: classType.type,
          instructor: classType.instructor,
          location: Math.random() > 0.3 ? 'Studio A' : (Math.random() > 0.5 ? 'Studio B' : 'online'),
          description: `${classType.title} with ${classType.instructor}`,
          isFull: isFull,
          spotsAvailable: spotsAvailable,
          spotsTotal: spotsTotal,
          isBooked: isBooked,
          bookingId: isBooked ? `booking-${i}-${j}` : null,
          bookingStatus: bookingStatus,
          creditCost: classType.creditCost,
          color: isBooked 
            ? (bookingStatus === 'confirmed' ? '#4CAF50' : '#FFC107') 
            : (isFull ? '#F44336' : '#2196F3')
        });
      }
    }
    
    return events;
  };
  
  // For testing, you can use these formats:
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
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
      <h2 className="text-2xl font-bold mb-6">Class Calendar</h2>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="text-sm text-gray-600 mb-4">
          <p className="mb-2">Color code:</p>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>Full</span>
            </div>
          </div>
        </div>
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>
      
      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600">
                <span className="font-medium">Instructor:</span> {selectedEvent.instructor}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Type:</span> {selectedEvent.classType === 'one-on-one' ? 'One-on-One Session' : 'Group Class'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Date:</span> {format(new Date(selectedEvent.start), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Time:</span> {format(new Date(selectedEvent.start), 'h:mm a')} - {format(new Date(selectedEvent.end), 'h:mm a')}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Location:</span> {selectedEvent.location}
              </p>
              {selectedEvent.classType === 'group' && (
                <p className="text-gray-600">
                  <span className="font-medium">Availability:</span> {selectedEvent.spotsAvailable} of {selectedEvent.spotsTotal} spots available
                </p>
              )}
              <p className="text-gray-600">
                <span className="font-medium">Credit Cost:</span> {
                  (selectedEvent.classType === 'group' && membershipInfo?.unlimitedGroupClasses) ||
                  (selectedEvent.classType === 'one-on-one' && membershipInfo?.unlimitedOneOnOne)
                    ? 'Included in your membership'
                    : `${selectedEvent.creditCost} credits`
                }
              </p>
              
              {selectedEvent.isBooked && (
                <div className="mt-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Booking Status:</span> 
                    <span className={`ml-1 ${
                      selectedEvent.bookingStatus === 'confirmed' ? 'text-green-600' : 
                      selectedEvent.bookingStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedEvent.bookingStatus.charAt(0).toUpperCase() + selectedEvent.bookingStatus.slice(1)}
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              
              {!selectedEvent.isBooked ? (
                <button
                  onClick={handleBookEvent}
                  disabled={selectedEvent.isFull}
                  className={`px-4 py-2 text-white rounded-md ${
                    selectedEvent.isFull
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {selectedEvent.isFull ? 'Class Full' : 'Book Now'}
                </button>
              ) : (
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 