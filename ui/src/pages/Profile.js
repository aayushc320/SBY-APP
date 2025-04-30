import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProfileInfo from '../components/profile/ProfileInfo';
import PasswordChange from '../components/profile/PasswordChange';
import NotificationSettings from '../components/profile/NotificationSettings';
import ProfilePicture from '../components/profile/ProfilePicture';
import AlertMessage from '../components/common/AlertMessage';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const { user, loading } = useContext(AuthContext);

  // Function to set the alert and auto-dismiss after 5 seconds
  const setAlertWithTimeout = (alertData) => {
    setAlert(alertData);
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'picture', label: 'Profile Picture' },
    { id: 'password', label: 'Change Password' },
    { id: 'notifications', label: 'Notification Settings' },
  ];

  if (loading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-custom py-16">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be logged in to view this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileInfo 
              user={user} 
              setAlert={setAlertWithTimeout} 
            />
          )}
          
          {activeTab === 'password' && (
            <PasswordChange 
              setAlert={setAlertWithTimeout} 
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationSettings 
              user={user} 
              setAlert={setAlertWithTimeout} 
            />
          )}
          
          {activeTab === 'picture' && (
            <ProfilePicture 
              user={user} 
              setAlert={setAlertWithTimeout} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 