import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

// Class table component
const ClassTable = ({ classes, onEdit, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const itemsPerPage = 10;

  // Sort function
  const sortedClasses = [...classes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter by search term
  const filteredClasses = sortedClasses.filter(yogaClass => 
    yogaClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yogaClass.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yogaClass.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

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
          <h3 className="text-lg font-semibold text-gray-800">Class Schedule</h3>
          <div className="mt-3 md:mt-0">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search classes..."
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
                onClick={() => requestSort('title')}
              >
                Class Title {getSortIndicator('title')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('instructor')}
              >
                Instructor {getSortIndicator('instructor')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('date')}
              >
                Date & Time {getSortIndicator('date')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('duration')}
              >
                Duration {getSortIndicator('duration')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('capacity')}
              >
                Capacity {getSortIndicator('capacity')}
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
            {currentClasses.map((yogaClass) => (
              <tr key={yogaClass.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-primary-100 rounded-md flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{yogaClass.title}</div>
                      <div className="text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getCategoryColor(yogaClass.category)}-100 text-${getCategoryColor(yogaClass.category)}-800`}>
                          {yogaClass.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{yogaClass.instructor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(yogaClass.date)}</div>
                  <div className="text-sm text-gray-500">{formatTime(yogaClass.startTime)} - {formatTime(yogaClass.endTime)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {yogaClass.duration} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{yogaClass.enrolled} / {yogaClass.capacity}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getCapacityColor(yogaClass.enrolled, yogaClass.capacity)}`} 
                      style={{ width: `${(yogaClass.enrolled / yogaClass.capacity) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onView(yogaClass)} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => onEdit(yogaClass)} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(yogaClass)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentClasses.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No classes found
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
              {indexOfLastItem > filteredClasses.length ? filteredClasses.length : indexOfLastItem}
            </span>{' '}
            of <span className="font-medium">{filteredClasses.length}</span> results
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

// Class modal component for adding/editing classes
const ClassModal = ({ yogaClass, instructors, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    capacity: 20,
    category: 'Vinyasa',
    credits: 1,
    location: 'Studio A',
    zoomLink: '',
    isOnline: false,
    isRecurring: false,
    recurringPattern: 'weekly'
  });

  useEffect(() => {
    if (yogaClass) {
      setFormData({
        title: yogaClass.title || '',
        description: yogaClass.description || '',
        instructor: yogaClass.instructor || '',
        date: yogaClass.date || '',
        startTime: yogaClass.startTime || '',
        endTime: yogaClass.endTime || '',
        duration: yogaClass.duration || 60,
        capacity: yogaClass.capacity || 20,
        category: yogaClass.category || 'Vinyasa',
        credits: yogaClass.credits || 1,
        location: yogaClass.location || 'Studio A',
        zoomLink: yogaClass.zoomLink || '',
        isOnline: yogaClass.isOnline || false,
        isRecurring: yogaClass.isRecurring || false,
        recurringPattern: yogaClass.recurringPattern || 'weekly'
      });
    } else {
      // Default values for new class
      setFormData({
        title: '',
        description: '',
        instructor: instructors.length > 0 ? instructors[0].name : '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        capacity: 20,
        category: 'Vinyasa',
        credits: 1,
        location: 'Studio A',
        zoomLink: '',
        isOnline: false,
        isRecurring: false,
        recurringPattern: 'weekly'
      });
    }
  }, [yogaClass, instructors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Calculate duration when start/end times change
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const durationMs = end - start;
      const durationMin = Math.round(durationMs / 60000);
      
      if (durationMin > 0) {
        setFormData(prev => ({ ...prev, duration: durationMin }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {yogaClass ? 'Edit Class' : 'Add New Class'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Class Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructor">
                  Instructor
                </label>
                <select
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.name}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Vinyasa">Vinyasa</option>
                  <option value="Hatha">Hatha</option>
                  <option value="Yin">Yin</option>
                  <option value="Power">Power</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Restorative">Restorative</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credits">
                  Credits Required
                </label>
                <input
                  id="credits"
                  name="credits"
                  type="number"
                  value={formData.credits}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  readOnly
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                  Capacity
                </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="1"
                  required
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    id="isOnline"
                    name="isOnline"
                    type="checkbox"
                    checked={formData.isOnline}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="isOnline">
                    Online Class
                  </label>
                </div>
              </div>
              
              {formData.isOnline ? (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zoomLink">
                    Zoom Link
                  </label>
                  <input
                    id="zoomLink"
                    name="zoomLink"
                    type="text"
                    value={formData.zoomLink}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://zoom.us/j/123456789"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 mb-6">
            <div className="flex items-center">
              <input
                id="isRecurring"
                name="isRecurring"
                type="checkbox"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="isRecurring">
                Recurring Class
              </label>
            </div>
            
            {formData.isRecurring && (
              <div className="mt-2 ml-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recurringPattern">
                  Repeats
                </label>
                <select
                  id="recurringPattern"
                  name="recurringPattern"
                  value={formData.recurringPattern}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
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

// Class details modal for viewing class information
const ClassDetailsModal = ({ yogaClass, isOpen, onClose, onEdit }) => {
  if (!isOpen || !yogaClass) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-900">
            Class Details
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{yogaClass.title}</h2>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getCategoryColor(yogaClass.category)}-100 text-${getCategoryColor(yogaClass.category)}-800`}>
                  {yogaClass.category}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  {yogaClass.credits} {yogaClass.credits === 1 ? 'credit' : 'credits'}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{yogaClass.description || 'No description available.'}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructor</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={yogaClass.instructorAvatar || 'https://randomuser.me/api/portraits/women/44.jpg'} 
                    alt={yogaClass.instructor} 
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{yogaClass.instructor}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Information</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Date:</span>
                <div className="font-medium">{formatDate(yogaClass.date)}</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Time:</span>
                <div className="font-medium">{formatTime(yogaClass.startTime)} - {formatTime(yogaClass.endTime)}</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Duration:</span>
                <div className="font-medium">{yogaClass.duration} minutes</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Capacity:</span>
                <div className="font-medium">{yogaClass.enrolled} / {yogaClass.capacity} students</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className={`h-2.5 rounded-full ${getCapacityColor(yogaClass.enrolled, yogaClass.capacity)}`} 
                    style={{ width: `${(yogaClass.enrolled / yogaClass.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Location:</span>
                <div className="font-medium">
                  {yogaClass.isOnline ? 'Online (Zoom)' : yogaClass.location}
                </div>
              </div>
              
              {yogaClass.isOnline && yogaClass.zoomLink && (
                <div>
                  <span className="text-gray-500 text-sm">Zoom Link:</span>
                  <div className="font-medium text-blue-600 break-all">
                    <a href={yogaClass.zoomLink} target="_blank" rel="noopener noreferrer">
                      {yogaClass.zoomLink}
                    </a>
                  </div>
                </div>
              )}

              {yogaClass.isRecurring && (
                <div>
                  <span className="text-gray-500 text-sm">Recurring:</span>
                  <div className="font-medium">
                    {yogaClass.recurringPattern === 'daily' && 'Daily'}
                    {yogaClass.recurringPattern === 'weekly' && 'Weekly'}
                    {yogaClass.recurringPattern === 'biweekly' && 'Every two weeks'}
                    {yogaClass.recurringPattern === 'monthly' && 'Monthly'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-300"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(yogaClass);
            }}
            className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
          >
            Edit Class
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete confirmation modal
const DeleteModal = ({ yogaClass, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !yogaClass) return null;

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
            Are you sure you want to delete the class <span className="font-bold">{yogaClass.title}</span> on <span className="font-bold">{formatDate(yogaClass.date)}</span> at <span className="font-bold">{formatTime(yogaClass.startTime)}</span>?
          </p>
          {yogaClass.enrolled > 0 && (
            <p className="mt-2 text-red-500">
              Warning: This class has {yogaClass.enrolled} enrolled students who will be affected.
            </p>
          )}
          {yogaClass.isRecurring && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-yellow-700">
                This is a recurring class. Do you want to:
              </p>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="deleteOption" defaultChecked className="h-4 w-4 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Delete only this occurrence</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="deleteOption" className="h-4 w-4 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Delete all future occurrences</span>
                </label>
              </div>
            </div>
          )}
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
            onClick={() => onConfirm(yogaClass.id)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, options);
};

const getCategoryColor = (category) => {
  const categories = {
    'Vinyasa': 'blue',
    'Hatha': 'green',
    'Yin': 'purple',
    'Power': 'red',
    'Meditation': 'indigo',
    'Restorative': 'yellow'
  };
  return categories[category] || 'gray';
};

const getCapacityColor = (enrolled, capacity) => {
  const percentage = (enrolled / capacity) * 100;
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 70) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

// Mock data for testing
const mockClassesData = [
  {
    id: 1,
    title: 'Morning Vinyasa Flow',
    description: 'Start your day with an energizing Vinyasa flow that will awaken your body and mind. Suitable for all levels.',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: '2023-07-15',
    startTime: '08:00',
    endTime: '09:00',
    duration: 60,
    capacity: 20,
    enrolled: 15,
    category: 'Vinyasa',
    credits: 1,
    location: 'Studio A',
    isOnline: false,
    isRecurring: true,
    recurringPattern: 'weekly'
  },
  {
    id: 2,
    title: 'Gentle Hatha Yoga',
    description: 'A slow-paced class focused on breathing and gentle stretching. Perfect for beginners or those recovering from injury.',
    instructor: 'Michael Chen',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    date: '2023-07-16',
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    capacity: 15,
    enrolled: 8,
    category: 'Hatha',
    credits: 1,
    location: 'Studio B',
    isOnline: false,
    isRecurring: false
  },
  {
    id: 3,
    title: 'Power Yoga',
    description: 'Challenging class that builds strength, flexibility and endurance. Previous yoga experience recommended.',
    instructor: 'Emma Wilson',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    date: '2023-07-17',
    startTime: '17:30',
    endTime: '18:30',
    duration: 60,
    capacity: 20,
    enrolled: 20,
    category: 'Power',
    credits: 2,
    location: 'Studio A',
    isOnline: false,
    isRecurring: true,
    recurringPattern: 'weekly'
  },
  {
    id: 4,
    title: 'Online Meditation',
    description: 'Guided meditation session to reduce stress and improve mental clarity. No experience needed.',
    instructor: 'John Smith',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    date: '2023-07-18',
    startTime: '19:00',
    endTime: '20:00',
    duration: 60,
    capacity: 30,
    enrolled: 12,
    category: 'Meditation',
    credits: 1,
    zoomLink: 'https://zoom.us/j/123456789',
    isOnline: true,
    isRecurring: false
  },
  {
    id: 5,
    title: 'Yin Yoga',
    description: 'Deep stretching practice where poses are held for longer periods. Promotes flexibility and relaxation.',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: '2023-07-19',
    startTime: '16:00',
    endTime: '17:30',
    duration: 90,
    capacity: 15,
    enrolled: 10,
    category: 'Yin',
    credits: 2,
    location: 'Studio B',
    isOnline: false,
    isRecurring: true,
    recurringPattern: 'biweekly'
  }
];

const mockInstructorsData = [
  { id: 1, name: 'Sarah Johnson', role: 'instructor' },
  { id: 2, name: 'Michael Chen', role: 'instructor' },
  { id: 3, name: 'Emma Wilson', role: 'instructor' },
  { id: 4, name: 'John Smith', role: 'instructor' }
];

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for modals
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [activeInstructor, setActiveInstructor] = useState('all');

  // Apply filters to class list
  const filteredClasses = classes.filter(yogaClass => {
    // Filter by class status (upcoming, past, all)
    if (activeFilter === 'upcoming') {
      const classDate = new Date(`${yogaClass.date}T${yogaClass.startTime}`);
      if (classDate < new Date()) return false;
    } else if (activeFilter === 'past') {
      const classDate = new Date(`${yogaClass.date}T${yogaClass.startTime}`);
      if (classDate >= new Date()) return false;
    }
    
    // Filter by instructor
    if (activeInstructor !== 'all' && yogaClass.instructor !== activeInstructor) {
      return false;
    }

    return true;
  });

  // Sort classes by date and time
  filteredClasses.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA - dateB;
  });

  // In a real app, you would fetch data from your API here
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, these would be API calls
      try {
        // const response = await axios.get('/api/admin/classes');
        // setClasses(response.data);
        
        // For demo, we're using mock data
        setTimeout(() => {
          setClasses(mockClassesData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching classes data:', error);
        setIsLoading(false);
      }
    };
    
    const fetchInstructors = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/admin/instructors');
        setInstructors(mockInstructorsData); // Use the setInstructors to avoid ESLint error
        // setIsLoading(false);
      } catch (error) {
        console.error('Error fetching instructors data:', error);
        // setIsLoading(false);
      }
    };

    fetchData();
    fetchInstructors();
  }, []);

  // Handle class operations
  const handleAddClass = () => {
    setCurrentClass(null);
    setClassModalOpen(true);
  };

  const handleEditClass = (yogaClass) => {
    setCurrentClass(yogaClass);
    setClassModalOpen(true);
  };

  const handleViewClass = (yogaClass) => {
    setCurrentClass(yogaClass);
    setDetailsModalOpen(true);
  };

  const handleSaveClass = (classData) => {
    if (currentClass) {
      // Edit existing class
      setClasses(classes.map(yogaClass => 
        yogaClass.id === currentClass.id ? { ...yogaClass, ...classData } : yogaClass
      ));
    } else {
      // Add new class
      setClasses([
        ...classes,
        {
          id: classes.length + 1,
          ...classData,
          enrolled: 0
        }
      ]);
    }
    setClassModalOpen(false);
  };

  const handleDeleteClass = (classId) => {
    setClasses(classes.filter(yogaClass => yogaClass.id !== classId));
    setDeleteModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
        <p className="text-gray-600">Schedule and manage yoga classes</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-wrap space-x-2 mb-4 md:mb-0">
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'upcoming' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveFilter('upcoming')}
          >
            Upcoming Classes
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'past' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveFilter('past')}
          >
            Past Classes
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Classes
          </button>
        </div>
        <button 
          onClick={handleAddClass}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Class
        </button>
      </div>

      {/* Instructor Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Instructor:</label>
        <select
          value={activeInstructor}
          onChange={(e) => setActiveInstructor(e.target.value)}
          className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Instructors</option>
          {instructors.map(instructor => (
            <option key={instructor.id} value={instructor.name}>
              {instructor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Class Table */}
      <ClassTable 
        classes={filteredClasses} 
        onEdit={handleEditClass}
        onView={handleViewClass}
        onDelete={(yogaClass) => {
          setCurrentClass(yogaClass);
          setDeleteModalOpen(true);
        }}
      />

      {/* Class Summary */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-500 font-medium">Total Classes</p>
            <p className="text-2xl font-bold text-blue-700">{classes.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-500 font-medium">Upcoming Classes</p>
            <p className="text-2xl font-bold text-green-700">
              {classes.filter(yogaClass => new Date(`${yogaClass.date}T${yogaClass.startTime}`) >= new Date()).length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-500 font-medium">Total Enrollments</p>
            <p className="text-2xl font-bold text-purple-700">
              {classes.reduce((total, yogaClass) => total + yogaClass.enrolled, 0)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-500 font-medium">Average Fill Rate</p>
            <p className="text-2xl font-bold text-yellow-700">
              {Math.round((classes.reduce((total, yogaClass) => total + (yogaClass.enrolled / yogaClass.capacity), 0) / classes.length) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClassModal 
        yogaClass={currentClass}
        instructors={instructors}
        isOpen={classModalOpen}
        onClose={() => setClassModalOpen(false)}
        onSave={handleSaveClass}
      />
      
      <ClassDetailsModal 
        yogaClass={currentClass}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onEdit={handleEditClass}
      />
      
      <DeleteModal 
        yogaClass={currentClass}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteClass}
      />
    </AdminLayout>
  );
};

export default ClassManagement; 