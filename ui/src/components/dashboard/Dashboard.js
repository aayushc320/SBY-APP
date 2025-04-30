import { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Dashboard components
import Overview from './Overview';
import GroupClasses from './GroupClasses';
import OneonOneBooking from './OneonOneBooking';
import MySchedule from './MySchedule';
import Profile from './Profile';
import Billing from './Billing';
import Calendar from './Calendar';

// Mock membership data for development
const mockMembershipInfo = {
  tier: "Premium",
  status: "active",
  nextBillingDate: "2024-07-15",
  credits: 8,
  unlimitedGroupClasses: true,
  unlimitedOneOnOne: false,
  features: [
    "Unlimited group classes",
    "8 one-on-one sessions per month",
    "Access to all studios",
    "Priority booking"
  ]
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [alert, setAlert] = useState(null);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the current path and set active section accordingly
    const path = window.location.pathname;
    const section = path.split('/').pop();
    if (section && section !== 'dashboard') {
      setActiveSection(section);
    }
    
    // Fetch user's membership info
    const fetchMembershipInfo = async () => {
      try {
        // Uncomment below when API is ready
        /*
        const res = await axios.get('/api/members/membership');
        setMembershipInfo(res.data.data);
        */
        
        // Mock data for development
        setTimeout(() => {
          setMembershipInfo(mockMembershipInfo);
        }, 500);
      } catch (err) {
        console.error('Error fetching membership info:', err);
        setAlert({
          type: 'error',
          message: 'Failed to load membership information'
        });
      }
    };
    
    fetchMembershipInfo();
  }, []);
  
  const handleNavigate = (section) => {
    setActiveSection(section);
    navigate(`/dashboard/${section === 'overview' ? '' : section}`);
  };
  
  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <div className="flex items-center space-x-4">
              {/* Notification bell icon */}
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* Profile dropdown */}
              <Link to="/dashboard/profile" className="flex items-center">
                <img 
                  className="h-8 w-8 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User profile" 
                />
                <span className="ml-2 text-sm font-medium text-gray-700 hover:text-gray-800">
                  John Doe
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && (
          <div className={`mb-4 p-4 rounded-md ${
            alert.type === 'success' ? 'bg-green-50 text-green-800' : 
            alert.type === 'error' ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {alert.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : alert.type === 'error' ? (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {alert.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button 
                    type="button" 
                    onClick={() => setAlert(null)}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      alert.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' : 
                      alert.type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' : 
                      'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                    }`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Credit info at a glance */}
        {membershipInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Credits Balance</h3>
              <p className="text-2xl font-bold text-indigo-600">{membershipInfo.credits}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Membership Tier</h3>
              <p className="text-2xl font-bold text-indigo-600">{membershipInfo.tier}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Next Billing Date</h3>
              <p className="text-2xl font-bold text-indigo-600">
                {new Date(membershipInfo.nextBillingDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar / Navigation */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <nav className="flex flex-col">
                {/* Dashboard Navigation */}
                <Link
                  to="/dashboard"
                  onClick={() => handleNavigate('overview')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'overview' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'overview' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Overview
                </Link>
                
                <Link
                  to="/dashboard/calendar"
                  onClick={() => handleNavigate('calendar')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'calendar' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'calendar' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Class Calendar
                </Link>
                
                <Link
                  to="/dashboard/classes"
                  onClick={() => handleNavigate('classes')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'classes' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'classes' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Group Classes
                </Link>
                
                <Link
                  to="/dashboard/oneOnOne"
                  onClick={() => handleNavigate('oneOnOne')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'oneOnOne' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'oneOnOne' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  One-on-One Sessions
                </Link>
                
                <Link
                  to="/dashboard/schedule"
                  onClick={() => handleNavigate('schedule')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'schedule' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'schedule' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                  My Schedule
                </Link>
                
                <hr className="border-gray-200" />
                
                <Link
                  to="/dashboard/profile"
                  onClick={() => handleNavigate('profile')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'profile' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'profile' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  My Profile
                </Link>
                
                <Link
                  to="/dashboard/billing"
                  onClick={() => handleNavigate('billing')}
                  className={`px-4 py-3 flex items-center text-sm font-medium ${
                    activeSection === 'billing' 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-5 w-5 ${activeSection === 'billing' ? 'text-indigo-500' : 'text-gray-400'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Billing & Membership
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-white shadow rounded-lg p-6">
              {!membershipInfo ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<Overview membershipInfo={membershipInfo} setAlert={setAlert} />} />
                  <Route path="/calendar" element={<Calendar membershipInfo={membershipInfo} setAlert={setAlert} />} />
                  <Route path="/classes" element={<GroupClasses membershipInfo={membershipInfo} setAlert={setAlert} />} />
                  <Route path="/oneOnOne" element={<OneonOneBooking membershipInfo={membershipInfo} setAlert={setAlert} />} />
                  <Route path="/schedule" element={<MySchedule setAlert={setAlert} />} />
                  <Route path="/profile" element={<Profile setAlert={setAlert} />} />
                  <Route path="/billing" element={<Billing membershipInfo={membershipInfo} setAlert={setAlert} />} />
                </Routes>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 