import React, { useState } from 'react';

const ClassCard = ({ classData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${classData.image})` }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white">
            <div className="inline-block px-2 py-1 bg-accent-500 text-white text-xs font-bold rounded mb-2">
              {classData.category}
            </div>
            <h3 className="text-xl font-bold">{classData.title}</h3>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img 
            src={classData.instructor.avatar} 
            alt={classData.instructor.name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="font-medium">{classData.instructor.name}</p>
            <p className="text-sm text-gray-600">{classData.instructor.title}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between text-sm mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{classData.time}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{classData.duration}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{classData.location}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>{classData.attendees} spots left</span>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded font-medium transition-colors">
          Book Class
        </button>
      </div>
    </div>
  );
};

const Classes = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock data for classes
  const classes = [
    {
      id: 1,
      title: "Morning Vinyasa Flow",
      category: "Yoga",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      instructor: {
        name: "Sarah Johnson",
        title: "Yoga Instructor",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      time: "Mon, Wed, Fri - 7:00 AM",
      duration: "60 min",
      location: "Studio A",
      attendees: 8,
      level: "All Levels"
    },
    {
      id: 2,
      title: "Power HIIT",
      category: "HIIT",
      image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      instructor: {
        name: "Mike Tanner",
        title: "Fitness Trainer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      time: "Tue, Thu - 6:00 PM",
      duration: "45 min",
      location: "Studio B",
      attendees: 5,
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Meditation & Mindfulness",
      category: "Meditation",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      instructor: {
        name: "Emma Wilson",
        title: "Meditation Guide",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      time: "Mon, Fri - 5:30 PM",
      duration: "30 min",
      location: "Studio C",
      attendees: 12,
      level: "All Levels"
    },
    {
      id: 4,
      title: "Pilates Core Power",
      category: "Pilates",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      instructor: {
        name: "Jennifer Lee",
        title: "Pilates Instructor",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      time: "Tue, Thu - 9:00 AM",
      duration: "50 min",
      location: "Studio A",
      attendees: 6,
      level: "Intermediate"
    },
    {
      id: 5,
      title: "Zumba Dance Party",
      category: "Dance",
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      instructor: {
        name: "Carlos Rodriguez",
        title: "Zumba Instructor",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg"
      },
      time: "Wed, Sat - 6:30 PM",
      duration: "60 min",
      location: "Studio B",
      attendees: 10,
      level: "All Levels"
    },
    {
      id: 6,
      title: "Gentle Yoga for Seniors",
      category: "Yoga",
      image: "https://images.unsplash.com/photo-1616699002805-0741e1e4a523?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      instructor: {
        name: "David Chen",
        title: "Yoga Therapist",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      },
      time: "Mon, Wed - 10:00 AM",
      duration: "45 min",
      location: "Studio C",
      attendees: 4,
      level: "Beginner"
    },
  ];
  
  // Get unique categories for filter
  const categories = ['all', ...new Set(classes.map(cls => cls.category.toLowerCase()))];
  
  // Filter classes based on selected category
  const filteredClasses = activeFilter === 'all' 
    ? classes 
    : classes.filter(cls => cls.category.toLowerCase() === activeFilter);
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Group Classes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our expert-led classes designed to help you achieve your fitness goals
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
        
        {/* No Results */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No classes found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes; 