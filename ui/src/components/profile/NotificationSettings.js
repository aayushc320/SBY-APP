import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const NotificationSettings = ({ user, setAlert }) => {
  const { updateUserDetails } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: {
      marketing: false,
      bookingReminders: false,
      classUpdates: false,
      accountAlerts: false
    },
    smsNotifications: {
      bookingReminders: false,
      promotions: false,
      accountAlerts: false
    }
  });

  // Fetch current notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/users/notification-settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching notification settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (category, setting) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.put('/api/users/notification-settings', settings);
      
      if (res.data.success) {
        setAlert({
          type: 'success',
          message: 'Notification settings updated successfully!'
        });
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to update notification settings'
        });
      }
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
          <div className="bg-white rounded-md -space-y-px">
            {/* Marketing Emails */}
            <div className="relative border rounded-tl-md rounded-tr-md p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications.marketing"
                  name="emailNotifications.marketing"
                  type="checkbox"
                  checked={settings.emailNotifications.marketing}
                  onChange={() => handleToggle('emailNotifications', 'marketing')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="emailNotifications.marketing" className="font-medium text-gray-700">
                  Marketing and Promotions
                </label>
                <p className="text-gray-500 text-sm">
                  Receive emails about special offers, promotions, and new features.
                </p>
              </div>
            </div>
            
            {/* Class Booking Reminders */}
            <div className="relative border border-t-0 p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications.bookingReminders"
                  name="emailNotifications.bookingReminders"
                  type="checkbox"
                  checked={settings.emailNotifications.bookingReminders}
                  onChange={() => handleToggle('emailNotifications', 'bookingReminders')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="emailNotifications.bookingReminders" className="font-medium text-gray-700">
                  Class Booking Reminders
                </label>
                <p className="text-gray-500 text-sm">
                  Receive reminders about your upcoming yoga class bookings.
                </p>
              </div>
            </div>
            
            {/* Class Updates */}
            <div className="relative border border-t-0 p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications.classUpdates"
                  name="emailNotifications.classUpdates"
                  type="checkbox"
                  checked={settings.emailNotifications.classUpdates}
                  onChange={() => handleToggle('emailNotifications', 'classUpdates')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="emailNotifications.classUpdates" className="font-medium text-gray-700">
                  Class Schedule Updates
                </label>
                <p className="text-gray-500 text-sm">
                  Receive notifications when class schedules change or new classes are added.
                </p>
              </div>
            </div>
            
            {/* Account Alerts */}
            <div className="relative border border-t-0 rounded-bl-md rounded-br-md p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications.accountAlerts"
                  name="emailNotifications.accountAlerts"
                  type="checkbox"
                  checked={settings.emailNotifications.accountAlerts}
                  onChange={() => handleToggle('emailNotifications', 'accountAlerts')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="emailNotifications.accountAlerts" className="font-medium text-gray-700">
                  Account Alerts
                </label>
                <p className="text-gray-500 text-sm">
                  Receive important account-related alerts (password changes, payment issues, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* SMS Notifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
          <div className="bg-white rounded-md -space-y-px">
            {/* Booking Reminders */}
            <div className="relative border rounded-tl-md rounded-tr-md p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="smsNotifications.bookingReminders"
                  name="smsNotifications.bookingReminders"
                  type="checkbox"
                  checked={settings.smsNotifications.bookingReminders}
                  onChange={() => handleToggle('smsNotifications', 'bookingReminders')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="smsNotifications.bookingReminders" className="font-medium text-gray-700">
                  Class Booking Reminders
                </label>
                <p className="text-gray-500 text-sm">
                  Receive SMS reminders about your upcoming yoga class bookings.
                </p>
              </div>
            </div>
            
            {/* Promotions */}
            <div className="relative border border-t-0 p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="smsNotifications.promotions"
                  name="smsNotifications.promotions"
                  type="checkbox"
                  checked={settings.smsNotifications.promotions}
                  onChange={() => handleToggle('smsNotifications', 'promotions')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="smsNotifications.promotions" className="font-medium text-gray-700">
                  Promotions and Special Offers
                </label>
                <p className="text-gray-500 text-sm">
                  Receive text messages about special offers and promotions.
                </p>
              </div>
            </div>
            
            {/* Account Alerts */}
            <div className="relative border border-t-0 rounded-bl-md rounded-br-md p-4 flex">
              <div className="flex items-center h-5">
                <input
                  id="smsNotifications.accountAlerts"
                  name="smsNotifications.accountAlerts"
                  type="checkbox"
                  checked={settings.smsNotifications.accountAlerts}
                  onChange={() => handleToggle('smsNotifications', 'accountAlerts')}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 flex-grow">
                <label htmlFor="smsNotifications.accountAlerts" className="font-medium text-gray-700">
                  Account Alerts
                </label>
                <p className="text-gray-500 text-sm">
                  Receive important account-related alerts via SMS.
                </p>
              </div>
            </div>
          </div>
          
          {!user.phoneVerified && user.phoneNumber && (
            <div className="mt-4 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Phone number not verified</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your phone number is not verified. Please verify your phone number to receive SMS notifications.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Verify Phone Number
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings; 