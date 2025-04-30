import { useState, useEffect } from 'react';
// Commented out as it's only used in commented code blocks
// import axios from 'axios';

// Mock data for group classes
const mockGroupClasses = [
  {
    _id: "gc001",
    title: "Vinyasa Flow Yoga",
    instructor: "Sarah Johnson",
    description: "A dynamic sequence of poses that flow with the breath, building strength, flexibility, and mindfulness.",
    duration: 60,
    difficulty: "Intermediate",
    category: "Yoga",
    date: "2024-06-20",
    time: "08:00",
    location: "Studio A",
    spotsAvailable: 12,
    totalSpots: 20,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc002",
    title: "HIIT Circuit Training",
    instructor: "Mike Chen",
    description: "High-intensity interval training that combines strength and cardio exercises for maximum calorie burn.",
    duration: 45,
    difficulty: "Advanced",
    category: "Cardio",
    date: "2024-06-20",
    time: "17:30",
    location: "Studio B",
    spotsAvailable: 8,
    totalSpots: 15,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc003",
    title: "Gentle Restorative Yoga",
    instructor: "Emma Taylor",
    description: "A peaceful practice focused on deep relaxation, with long-held poses supported by props.",
    duration: 75,
    difficulty: "Beginner",
    category: "Yoga",
    date: "2024-06-21",
    time: "10:00",
    location: "Studio A",
    spotsAvailable: 15,
    totalSpots: 20,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc004",
    title: "Spinning Class",
    instructor: "David Rodriguez",
    description: "An energetic indoor cycling workout set to motivating music for an intense cardio session.",
    duration: 45,
    difficulty: "Intermediate",
    category: "Cardio",
    date: "2024-06-21",
    time: "18:00",
    location: "Cycling Studio",
    spotsAvailable: 10,
    totalSpots: 20,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc005",
    title: "Pilates Core Focus",
    instructor: "Lisa Wong",
    description: "Build core strength, improve posture, and enhance flexibility with controlled, precise movements.",
    duration: 60,
    difficulty: "Intermediate",
    category: "Conditioning",
    date: "2024-06-22",
    time: "09:30",
    location: "Studio C",
    spotsAvailable: 12,
    totalSpots: 15,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc006",
    title: "Power Bootcamp",
    instructor: "James Wilson",
    description: "Military-inspired workout combining strength, cardio, and agility exercises for a full-body challenge.",
    duration: 60,
    difficulty: "Advanced",
    category: "Strength",
    date: "2024-06-22",
    time: "16:00",
    location: "Outdoor Area",
    spotsAvailable: 18,
    totalSpots: 25,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc007",
    title: "Mindful Meditation",
    instructor: "Sarah Johnson",
    description: "Guided meditation session focused on mindfulness, stress reduction, and mental clarity.",
    duration: 45,
    difficulty: "Beginner",
    category: "Mind & Body",
    date: "2024-06-23",
    time: "08:00",
    location: "Studio A",
    spotsAvailable: 20,
    totalSpots: 30,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "gc008",
    title: "CrossFit",
    instructor: "Mike Chen",
    description: "High-intensity functional movements that combine gymnastics, weightlifting, and cardio.",
    duration: 60,
    difficulty: "Advanced",
    category: "Strength",
    date: "2024-06-23",
    time: "18:30",
    location: "Functional Training Area",
    spotsAvailable: 5,
    totalSpots: 12,
    creditCost: 0,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const GroupClasses = ({ membershipInfo, setAlert }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  // Get unique values for filters
  const uniqueInstructors = [...new Set(mockGroupClasses.map(c => c.instructor))];
  const uniqueCategories = [...new Set(mockGroupClasses.map(c => c.category))];
  const uniqueDifficulties = [...new Set(mockGroupClasses.map(c => c.difficulty))];
  const uniqueDates = [...new Set(mockGroupClasses.map(c => c.date))];
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // When API is ready, uncomment below
        /*
        const res = await axios.get('/api/classes/group');
        setClasses(res.data.data);
        setFilteredClasses(res.data.data);
        */
        
        // Using mock data for now
        setTimeout(() => {
          setClasses(mockGroupClasses);
          setFilteredClasses(mockGroupClasses);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error('Error fetching group classes:', err);
        setAlert({
          type: 'error',
          message: 'Failed to load group classes'
        });
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [setAlert]);
  
  // Apply filters whenever filter values change
  useEffect(() => {
    let results = classes;
    
    if (filterDifficulty) {
      results = results.filter(c => c.difficulty === filterDifficulty);
    }
    
    if (filterInstructor) {
      results = results.filter(c => c.instructor === filterInstructor);
    }
    
    if (filterCategory) {
      results = results.filter(c => c.category === filterCategory);
    }
    
    if (filterDate) {
      results = results.filter(c => c.date === filterDate);
    }
    
    setFilteredClasses(results);
  }, [classes, filterDifficulty, filterInstructor, filterCategory, filterDate]);
  
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
  };
  
  const clearFilters = () => {
    setFilterDifficulty('');
    setFilterInstructor('');
    setFilterCategory('');
    setFilterDate('');
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleBookClass = async (classId) => {
    // Check if user has unlimited group classes or enough credits
    const targetClass = classes.find(c => c._id === classId);
    
    if (!targetClass) {
      setAlert({
        type: 'error',
        message: 'Class not found'
      });
      return;
    }
    
    if (targetClass.spotsAvailable <= 0) {
      setAlert({
        type: 'error',
        message: 'This class is fully booked'
      });
      return;
    }
    
    // Check if user can book this class
    const canBookClass = membershipInfo?.unlimitedGroupClasses || 
                         (membershipInfo?.credits >= targetClass.creditCost);
    
    if (!canBookClass) {
      setAlert({
        type: 'error',
        message: 'Insufficient credits to book this class'
      });
      return;
    }
    
    try {
      // When API is ready, uncomment below
      /*
      const res = await axios.post('/api/bookings/group', { classId });
      
      if (res.data.success) {
        // Update available spots
        setClasses(prevClasses => 
          prevClasses.map(c => 
            c._id === classId 
              ? { ...c, spotsAvailable: c.spotsAvailable - 1 } 
              : c
          )
        );
        
        // Update credits if applicable
        if (!membershipInfo.unlimitedGroupClasses && targetClass.creditCost > 0) {
          // This would actually be handled by the parent component and API
          console.log(`Credits used: ${targetClass.creditCost}`);
        }
      */
      
      // Mock success for now
      setClasses(prevClasses => 
        prevClasses.map(c => 
          c._id === classId 
            ? { ...c, spotsAvailable: c.spotsAvailable - 1 } 
            : c
        )
      );
      
      setAlert({
        type: 'success',
        message: `Successfully booked: ${targetClass.title}`
      });
    } catch (err) {
      console.error('Error booking class:', err);
      setAlert({
        type: 'error',
        message: 'Failed to book class. Please try again.'
      });
    }
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
      <h2 className="text-2xl font-bold mb-6">Group Classes</h2>
      
      {/* Credits info */}
      {membershipInfo && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-indigo-800">
                {membershipInfo.unlimitedGroupClasses 
                  ? 'Unlimited Group Classes' 
                  : `Credits: ${membershipInfo.credits}`}
              </h3>
              <p className="text-sm text-indigo-600">
                {membershipInfo.unlimitedGroupClasses 
                  ? 'Book as many group classes as you want with your Premium membership' 
                  : 'Use your credits to book group classes and one-on-one sessions'}
              </p>
            </div>
            <span className="text-indigo-700 font-bold text-xl px-4 py-2 bg-white rounded-lg shadow-sm">
              {membershipInfo.unlimitedGroupClasses ? '∞' : membershipInfo.credits}
            </span>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Filter Classes</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={filterDifficulty}
                onChange={handleFilterChange(setFilterDifficulty)}
              >
                <option value="">All Levels</option>
                {uniqueDifficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            
            {/* Instructor Filter */}
            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                Instructor
              </label>
              <select
                id="instructor"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={filterInstructor}
                onChange={handleFilterChange(setFilterInstructor)}
              >
                <option value="">All Instructors</option>
                {uniqueInstructors.map(instructor => (
                  <option key={instructor} value={instructor}>{instructor}</option>
                ))}
              </select>
            </div>
            
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={filterCategory}
                onChange={handleFilterChange(setFilterCategory)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <select
                id="date"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={filterDate}
                onChange={handleFilterChange(setFilterDate)}
              >
                <option value="">All Dates</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="space-y-6">
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No classes match your filters</p>
          </div>
        ) : (
          filteredClasses.map(classItem => (
            <div key={classItem._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                {/* Class Image */}
                <div className="md:w-1/4">
                  <img 
                    src={classItem.image} 
                    alt={classItem.title} 
                    className="h-48 w-full object-cover md:h-full"
                  />
                </div>
                
                {/* Class Details */}
                <div className="p-6 md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{classItem.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">with {classItem.instructor}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      classItem.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      classItem.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {classItem.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{classItem.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="block text-xs text-gray-500">DATE</span>
                      <span className="font-medium">{formatDate(classItem.date)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">TIME</span>
                      <span className="font-medium">{formatTime(classItem.time)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">DURATION</span>
                      <span className="font-medium">{classItem.duration} minutes</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">LOCATION</span>
                      <span className="font-medium">{classItem.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className={`${
                        classItem.spotsAvailable <= 3 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {classItem.spotsAvailable} spots left
                      </span>
                      {' '}<span className="text-xs text-gray-500">of {classItem.totalSpots}</span>
                    </div>
                    
                    <button
                      onClick={() => handleBookClass(classItem._id)}
                      disabled={classItem.spotsAvailable <= 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        classItem.spotsAvailable <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {classItem.spotsAvailable <= 0 
                        ? 'Fully Booked' 
                        : membershipInfo?.unlimitedGroupClasses || classItem.creditCost === 0
                          ? 'Book Class'
                          : `Book for ${classItem.creditCost} credits`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupClasses; 