import React from 'react';
import axios from 'axios';

const UpcomingClasses = ({ upcomingClasses, setAlert }) => {
  const cancelBooking = async (bookingId) => {
    try {
      const res = await axios.delete(`/api/bookings/${bookingId}`);
      
      if (res.data.success) {
        setAlert({
          type: 'success',
          message: 'Class booking cancelled successfully!'
        });
        // Refresh page to update the list
        window.location.reload();
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to cancel booking'
        });
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    }
  };

  // Format date and time
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Calculate if cancellation is still allowed (24 hours before class)
  const canCancelBooking = (startTime) => {
    const now = new Date();
    const classTime = new Date(startTime);
    const hoursDifference = (classTime - now) / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  if (upcomingClasses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming classes</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have any upcoming classes scheduled. Book a class to get started!
        </p>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => document.getElementById('tabButton_groupClasses').click()}
          >
            Browse Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Upcoming Classes</h2>
      <div className="bg-white overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {upcomingClasses.map((booking) => {
            const { date, time } = formatDateTime(booking.startTime);
            const endTime = formatDateTime(booking.endTime).time;
            const allowCancellation = canCancelBooking(booking.startTime);
            
            return (
              <li key={booking._id} className="p-4 sm:px-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {booking.class.isOneOnOne ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            1-on-1
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Group
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-800">{booking.class.title}</h3>
                        <p className="text-sm text-gray-500">
                          with {booking.class.instructor.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {date}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {time} - {endTime}
                    </div>
                    
                    {booking.class.location && (
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {booking.class.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <div>
                    {booking.class.isVirtual && (
                      <a
                        href={booking.class.zoomLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Join Online
                        <svg className="ml-1 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  
                  {allowCancellation ? (
                    <button
                      type="button"
                      onClick={() => cancelBooking(booking._id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-sm leading-4 font-medium text-gray-500">
                      Cannot cancel (less than 24h notice)
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UpcomingClasses; 