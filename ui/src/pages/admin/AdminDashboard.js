import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

// Stats card component
const StatCard = ({ title, value, icon, change, changeType }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
          
          {change && (
            <div className={`flex items-center mt-2 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
              <span className="text-sm font-medium">{change}%</span>
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={changeType === 'increase' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                />
              </svg>
              <span className="text-gray-500 text-xs ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className="bg-primary-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Chart component (simplified, would use Chart.js or similar in real app)
const SimpleChart = ({ title, data, type = 'bar' }) => {
  // This is a placeholder for a real chart library
  // In a production app, you'd use Chart.js, Recharts, etc.
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-500">Chart visualization would appear here</p>
      </div>
      <div className="flex justify-between mt-4">
        {data.labels.map((label, index) => (
          <div key={index} className="text-center">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold">{data.values[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent activity component
const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <li key={index} className="py-3">
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${activity.iconBg}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalUsers: '1,249',
    totalClasses: '84',
    activeSubscriptions: '756',
    revenue: '$12,426'
  });
  
  const [chartData] = useState({
    users: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [452, 532, 619, 674, 819, 1249]
    },
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: ['$4,286', '$5,632', '$6,218', '$8,932', '$10,025', '$12,426']
    }
  });
  
  const [recentActivities] = useState([
    {
      title: 'New User Registration',
      description: 'Emma Wilson signed up for an account',
      time: '2 hours ago',
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"></path>
        </svg>
      )
    },
    {
      title: 'New Class Added',
      description: 'Morning Vinyasa Flow added by Sarah Johnson',
      time: '4 hours ago',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      title: 'Subscription Upgraded',
      description: 'John Smith upgraded to Premium plan',
      time: '6 hours ago',
      iconBg: 'bg-purple-100',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      title: 'Class Canceled',
      description: 'Evening Meditation canceled by instructor',
      time: '10 hours ago',
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      title: 'Credits Added',
      description: 'Admin added 20 credits to Michael Chen',
      time: '12 hours ago',
      iconBg: 'bg-yellow-100',
      icon: (
        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ]);

  // In a real app, you would fetch data from your API here
  useEffect(() => {
    // Mock API fetch
    const fetchData = async () => {
      try {
        // const response = await axios.get('/api/admin/dashboard');
        // setStats(response.data.stats);
        
        // For demo, we're using the mock data already set in state
        console.log('Dashboard data would be fetched here in a real app');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor and manage your yoga platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          change="12.5" 
          changeType="increase"
          icon={
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
            </svg>
          }
        />
        <StatCard 
          title="Total Classes" 
          value={stats.totalClasses} 
          change="8.3" 
          changeType="increase"
          icon={
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
            </svg>
          }
        />
        <StatCard 
          title="Active Subscriptions" 
          value={stats.activeSubscriptions} 
          change="5.2" 
          changeType="increase"
          icon={
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
          }
        />
        <StatCard 
          title="Monthly Revenue" 
          value={stats.revenue} 
          change="24.1" 
          changeType="increase"
          icon={
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SimpleChart 
          title="User Growth" 
          data={chartData.users} 
          type="line"
        />
        <SimpleChart 
          title="Revenue" 
          data={chartData.revenue} 
          type="bar"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        <RecentActivity activities={recentActivities} />
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow border-l-4 border-primary-500 hover:bg-gray-50 transition-colors flex items-center">
            <svg className="w-6 h-6 text-primary-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
            <span>Add New Class</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500 hover:bg-gray-50 transition-colors flex items-center">
            <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
            </svg>
            <span>Add New User</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500 hover:bg-gray-50 transition-colors flex items-center">
            <svg className="w-6 h-6 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
            </svg>
            <span>Create Plan</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500 hover:bg-gray-50 transition-colors flex items-center">
            <svg className="w-6 h-6 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>Send Notification</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 