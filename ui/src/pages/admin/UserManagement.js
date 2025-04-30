import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import axios from 'axios';

// User table component
const UserTable = ({ users, onEdit, onDelete, onCredits, onChangeRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const itemsPerPage = 10;

  // Sort function
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter by search term
  const filteredUsers = sortedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
          <div className="mt-3 md:mt-0">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="border border-gray-300 rounded-lg py-2 px-4 pl-10 block w-full text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                Name {getSortIndicator('name')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('email')}
              >
                Email {getSortIndicator('email')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('role')}
              >
                Role {getSortIndicator('role')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                Status {getSortIndicator('status')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('credits')}
              >
                Credits {getSortIndicator('credits')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={user.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                        alt={user.name} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">Member since {new Date(user.joinedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'instructor' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`
                  }>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800'}`
                  }>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.credits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(user)} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onCredits(user)} 
                      className="text-green-600 hover:text-green-900"
                    >
                      Credits
                    </button>
                    <button 
                      onClick={() => onChangeRole(user)} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Role
                    </button>
                    <button 
                      onClick={() => onDelete(user)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastItem > filteredUsers.length ? filteredUsers.length : indexOfLastItem}
            </span>{' '}
            of <span className="font-medium">{filteredUsers.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User modal component for adding/editing users
const UserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    credits: 0,
    status: 'active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        credits: user.credits || 0,
        status: user.status || 'active'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">User</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credits">
              Credits
            </label>
            <input
              id="credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Credits modal component
const CreditsModal = ({ user, isOpen, onClose, onSave }) => {
  const [credits, setCredits] = useState(0);
  const [operation, setOperation] = useState('add');

  useEffect(() => {
    if (user) {
      setCredits(0); // Reset on open
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      userId: user?.id,
      credits: parseInt(credits),
      operation
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Manage Credits for {user.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">Current Credits: <span className="font-bold">{user.credits}</span></p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operation">
              Operation
            </label>
            <div className="flex">
              <button
                type="button"
                className={`flex-1 py-2 ${operation === 'add' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setOperation('add')}
              >
                Add Credits
              </button>
              <button
                type="button"
                className={`flex-1 py-2 ${operation === 'remove' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setOperation('remove')}
              >
                Remove Credits
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credits">
              Credits Amount
            </label>
            <input
              id="credits"
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Role change modal
const RoleModal = ({ user, isOpen, onClose, onSave }) => {
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (user) {
      setRole(user.role || 'user');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      userId: user?.id,
      role
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Change Role for {user.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">User</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete confirmation modal
const DeleteModal = ({ user, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Confirm Deletion
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete the user <span className="font-bold">{user.name}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(user.id)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Add this Alert component before the UserManagement component
const Alert = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  
  return (
    <div className={`${bgColor} px-4 py-3 rounded relative mb-4 border`} role="alert">
      <strong className="font-bold mr-2">
        {type === 'success' ? 'Success!' : 'Error!'}
      </strong>
      <span className="block sm:inline">{message}</span>
      <button 
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={onClose}
      >
        <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
        </svg>
      </button>
    </div>
  );
};

const UserManagement = () => {
  // State for users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState('all');

  // State for alerts/notifications
  const [alert, setAlert] = useState(null);

  // Filter users by role
  const filteredUsers = activeRole === 'all' 
    ? users 
    : users.filter(user => user.role === activeRole);

  // Fetch users from MongoDB database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Use the MongoDB endpoint
        const response = await axios.get('http://localhost:5000/api/mongodb/users');
        
        // Log the full response for debugging
        console.log('MongoDB Response:', response);
        
        // Handle the MongoDB response format
        const userData = response.data || [];
        console.log('User data from MongoDB:', userData);
        console.log('Number of users fetched:', userData.length);
        
        // Transform the data to match the expected format
        const formattedUsers = Array.isArray(userData) ? userData.map(user => ({
          id: user._id,
          name: user.name || 'Unknown',
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'active',
          credits: user.credits || 0,
          avatar: user.avatar ? `/uploads/avatars/${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`,
          joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        })) : [];
        
        console.log('Formatted users for display:', formattedUsers);
        setUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users from MongoDB:', error);
        
        setError('Failed to load users from database. Please check server connection.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to set an alert and auto-dismiss after 5 seconds
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Handle user operations
  const handleAddUser = () => {
    setCurrentUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setUserModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (currentUser) {
        // Edit existing user - use the MongoDB endpoint
        console.log('Updating user:', currentUser.id, userData);
        await axios.put(`http://localhost:5000/api/mongodb/users/${currentUser.id}`, userData);
        
        // Update state
        setUsers(users.map(user => 
          user.id === currentUser.id ? { ...user, ...userData } : user
        ));
        showAlert('success', `User ${userData.name} updated successfully`);
      } else {
        // Add new user - use the MongoDB endpoint
        console.log('Adding new user:', userData);
        const response = await axios.post('http://localhost:5000/api/mongodb/users', userData);
        
        // Update state with the newly created user
        const newUser = response.data;
        setUsers([
          ...users,
          {
            id: newUser._id,
            name: newUser.name || 'Unknown',
            email: newUser.email || '',
            role: newUser.role || 'user',
            status: newUser.status || 'active',
            credits: newUser.credits || 0,
            avatar: newUser.avatar ? `/uploads/avatars/${newUser.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name || 'User')}`,
            joinedDate: newUser.createdAt ? new Date(newUser.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }
        ]);
        showAlert('success', `User ${userData.name} added successfully`);
      }
      setUserModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      showAlert('error', `Error ${currentUser ? 'updating' : 'adding'} user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Delete user from the API using the MongoDB endpoint
      console.log('Deleting user:', userId);
      await axios.delete(`http://localhost:5000/api/mongodb/users/${userId}`);
      
      // Update state
      const userToDelete = users.find(u => u.id === userId);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteModalOpen(false);
      showAlert('success', `User ${userToDelete?.name || userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      showAlert('error', `Error deleting user: ${error.message}`);
    }
  };

  const handleManageCredits = (user) => {
    setCurrentUser(user);
    setCreditModalOpen(true);
  };

  const handleSaveCredits = async ({ userId, credits, operation }) => {
    try {
      // Calculate new credit balance
      const user = users.find(u => u.id === userId);
      const newCredits = operation === 'add' 
        ? user.credits + credits 
        : Math.max(0, user.credits - credits);
      
      // Update user credits using the MongoDB endpoint
      console.log('Updating credits for user:', userId, 'New credits:', newCredits);
      await axios.put(`http://localhost:5000/api/mongodb/users/${userId}/credits`, { credits: newCredits });
      
      // Update state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, credits: newCredits };
        }
        return user;
      }));
      
      setCreditModalOpen(false);
      showAlert('success', `Credits ${operation === 'add' ? 'added to' : 'removed from'} ${user.name}`);
    } catch (error) {
      console.error('Error updating credits:', error);
      showAlert('error', `Error updating credits: ${error.message}`);
    }
  };

  const handleChangeRole = (user) => {
    setCurrentUser(user);
    setRoleModalOpen(true);
  };

  const handleSaveRole = async ({ userId, role }) => {
    try {
      // Update user role using the MongoDB endpoint
      console.log('Updating role for user:', userId, 'New role:', role);
      await axios.put(`http://localhost:5000/api/mongodb/users/${userId}/role`, { role });
      
      // Update state
      const user = users.find(u => u.id === userId);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
      
      setRoleModalOpen(false);
      showAlert('success', `Role updated for ${user?.name || userId}`);
    } catch (error) {
      console.error('Error updating role:', error);
      showAlert('error', `Error updating role: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        )}
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">Manage all users and instructors on the platform</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <button 
            className={`px-4 py-2 rounded-lg ${activeRole === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveRole('all')}
          >
            All Users
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeRole === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveRole('user')}
          >
            Students
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeRole === 'instructor' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveRole('instructor')}
          >
            Instructors
          </button>
        </div>
        <button 
          onClick={handleAddUser}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New User
        </button>
      </div>

      {/* User Table */}
      <UserTable 
        users={filteredUsers} 
        onEdit={handleEditUser}
        onDelete={(user) => {
          setCurrentUser(user);
          setDeleteModalOpen(true);
        }}
        onCredits={handleManageCredits}
        onChangeRole={handleChangeRole}
      />

      {/* Modals */}
      <UserModal 
        user={currentUser}
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSave={handleSaveUser}
      />
      
      <CreditsModal 
        user={currentUser}
        isOpen={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        onSave={handleSaveCredits}
      />
      
      <RoleModal 
        user={currentUser}
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleSaveRole}
      />
      
      <DeleteModal 
        user={currentUser}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </AdminLayout>
  );
};

export default UserManagement; 