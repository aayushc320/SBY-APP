import { Link } from 'react-router-dom';

const Home = () => {
  // Dummy data for featured classes
  const featuredClasses = [
    {
      id: 1,
      title: 'Vinyasa Flow',
      instructor: 'Sarah Johnson',
      level: 'All Levels',
      image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'A dynamic practice that synchronizes movement with breath to create a flowing sequence.',
    },
    {
      id: 2,
      title: 'Restorative Yoga',
      instructor: 'Michael Chen',
      level: 'Beginner',
      image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'A gentle, slow-paced style where poses are held for longer periods to promote relaxation.',
    },
    {
      id: 3,
      title: 'Power Yoga',
      instructor: 'Emily Rodriguez',
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'A fitness-based approach focusing on building strength, endurance, and flexibility.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          }}
        ></div>
        <div className="container-custom relative py-24 md:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Body and Mind with Yoga
            </h1>
            <p className="text-xl mb-8">
              Join our online community of yoga practitioners and expert instructors.
              Experience the power of yoga anywhere, anytime.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/classes"
                className="btn btn-secondary text-lg px-8 py-3 rounded-md"
              >
                Browse Classes
              </Link>
              <Link
                to="/pricing"
                className="btn text-lg px-8 py-3 rounded-md bg-white text-primary-900 hover:bg-gray-100"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-6">
              Welcome to Strong By Yoga
            </h2>
            <p className="text-lg text-gray-700">
              We believe that yoga is for everyone, regardless of age, fitness level, or
              experience. Our platform brings together expert instructors and passionate
              students, creating a supportive community focused on strength, wellness, and
              personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Live Online Classes</h3>
              <p className="text-gray-600">
                Join our experienced instructors in real-time for interactive yoga sessions
                from the comfort of your home.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from certified yoga professionals who guide you through each pose with
                clear instructions and modifications.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">
                Choose from various class times that fit your schedule, or practice on-demand
                with our recorded sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Classes Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Featured Classes
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Discover our most popular yoga classes taught by expert instructors.
              From beginner-friendly to advanced sessions, find the perfect practice for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredClasses.map((yogaClass) => (
              <div
                key={yogaClass.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={yogaClass.image}
                  alt={yogaClass.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-primary-800">
                      {yogaClass.title}
                    </h3>
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {yogaClass.level}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Instructor: {yogaClass.instructor}
                  </p>
                  <p className="text-gray-700 mb-4">{yogaClass.description}</p>
                  <Link
                    to={`/classes/${yogaClass.id}`}
                    className="btn btn-outline w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/classes"
              className="btn btn-primary px-8 py-3 rounded-md inline-block"
            >
              View All Classes
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-500 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Yoga Journey?
            </h2>
            <p className="text-lg mb-8">
              Join our community today and get access to expert-led yoga classes,
              personalized guidance, and a supportive environment to help you grow stronger.
            </p>
            <Link
              to="/register"
              className="btn px-8 py-3 rounded-md bg-white text-accent-600 hover:bg-gray-100 inline-block"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 