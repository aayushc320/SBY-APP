import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import UpcomingClasses from '../components/dashboard/UpcomingClasses';
import OneonOneBooking from '../components/dashboard/OneonOneBooking';
import GroupClasses from '../components/dashboard/GroupClasses';
import MembershipInfo from '../components/dashboard/MembershipInfo';
import AlertMessage from '../components/common/AlertMessage';
import axios from 'axios';

// Mock data for development
const mockUpcomingClasses = [
  {
    _id: '1',
    class: {
      title: 'Vinyasa Flow',
      instructor: { name: 'Sarah Johnson' },
      isOneOnOne: false,
      isVirtual: true,
      zoomLink: 'https://zoom.us/j/123456789',
      location: null
    },
    startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString() // 1 hour later
  },
  {
    _id: '2',
    class: {
      title: 'Hatha Yoga',
      instructor: { name: 'Michael Chen' },
      isOneOnOne: false,
      isVirtual: false,
      location: 'Studio A, 123 Yoga Street'
    },
    startTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    endTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString() // 1.25 hours later
  },
  {
    _id: '3',
    class: {
      title: 'Personal Training Session',
      instructor: { name: 'Emma Wilson' },
      isOneOnOne: true,
      isVirtual: false,
      location: 'Studio B, 123 Yoga Street'
    },
    startTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    endTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString() // 45 minutes later
  }
];

const mockMembershipInfo = {
  plan: 'Unlimited',
  status: 'active',
  credits: 8,
  nextBillingDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
  memberSince: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
  classesAttended: 24,
  unlimitedGroupClasses: true,
  unlimitedOneOnOne: false
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [dashboardData, setDashboardData] = useState({
    upcomingClasses: [],
    membershipInfo: null,
    loading: true,
    error: null
  });
  const [alert, setAlert] = useState(null);

  // Function to set the alert and auto-dismiss after 5 seconds
  const setAlertWithTimeout = (alertData) => {
    setAlert(alertData);
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Tabs configuration
  const tabs = [
    { id: 'upcoming', label: 'Upcoming Classes' },
    { id: 'oneOnOne', label: '1-on-1 Sessions' },
    { id: 'groupClasses', label: 'Group Classes' },
    { id: 'membership', label: 'Membership & Credits' },
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Uncomment the below code when the real API is ready
        // and comment out the setTimeout mock data approach
        /*
        // Fetch the user's upcoming classes
        const upcomingRes = await axios.get('/api/bookings/upcoming');
        
        // Fetch membership and credit information
        const membershipRes = await axios.get('/api/users/membership');
        
        setDashboardData({
          upcomingClasses: upcomingRes.data.data,
          membershipInfo: membershipRes.data.data,
          loading: false,
          error: null
        });
        */

        // Using setTimeout to simulate API delay
        setTimeout(() => {
          setDashboardData({
            upcomingClasses: mockUpcomingClasses,
            membershipInfo: mockMembershipInfo,
            loading: false,
            error: null
          });
        }, 1000);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setDashboardData({
          ...dashboardData,
          loading: false,
          error: 'Failed to load dashboard data. Please try again later.'
        });
      }
    };

    fetchDashboardData();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {dashboardData.error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name || 'Yogi'}!</p>
      
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      
      {/* Mobile-friendly stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Balance</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{dashboardData.membershipInfo?.credits || 0}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</h3>
          <p className="mt-2 text-lg font-semibold text-gray-800">{dashboardData.membershipInfo?.plan || 'None'}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Next Class</h3>
          <p className="mt-2 text-lg font-semibold text-gray-800">
            {dashboardData.upcomingClasses.length > 0 
              ? `${dashboardData.upcomingClasses[0].class.title} (${new Date(dashboardData.upcomingClasses[0].startTime).toLocaleDateString()})` 
              : 'No upcoming classes'}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Classes Attended</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{dashboardData.membershipInfo?.classesAttended || 0}</p>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                id={`tabButton_${tab.id}`}
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
          {activeTab === 'upcoming' && (
            <UpcomingClasses 
              upcomingClasses={dashboardData.upcomingClasses} 
              setAlert={setAlertWithTimeout} 
            />
          )}
          
          {activeTab === 'oneOnOne' && (
            <OneonOneBooking 
              setAlert={setAlertWithTimeout}
              membershipInfo={dashboardData.membershipInfo}
            />
          )}
          
          {activeTab === 'groupClasses' && (
            <GroupClasses 
              setAlert={setAlertWithTimeout}
              membershipInfo={dashboardData.membershipInfo}
            />
          )}
          
          {activeTab === 'membership' && (
            <MembershipInfo 
              membershipInfo={dashboardData.membershipInfo}
              setAlert={setAlertWithTimeout} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 