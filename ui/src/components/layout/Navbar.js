import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li>
        <Link
          to="/dashboard"
          className="block py-2 px-3 text-primary-600 hover:text-primary-800"
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/classes"
          className="block py-2 px-3 text-primary-600 hover:text-primary-800"
        >
          Classes
        </Link>
      </li>
      {user && (user.role === 'instructor' || user.role === 'admin') && (
        <li>
          <Link
            to="/teaching"
            className="block py-2 px-3 text-primary-600 hover:text-primary-800"
          >
            My Classes
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/profile"
          className="block py-2 px-3 text-primary-600 hover:text-primary-800"
        >
          Profile
        </Link>
      </li>
      <li>
        <button
          onClick={onLogout}
          className="block w-full text-left py-2 px-3 text-primary-600 hover:text-primary-800"
        >
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link
          to="/register"
          className="block py-2 px-3 text-primary-600 hover:text-primary-800"
        >
          Register
        </Link>
      </li>
      <li>
        <Link
          to="/login"
          className="block py-2 px-3 text-primary-600 hover:text-primary-800"
        >
          Login
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold text-primary-600">
                Strong By Yoga
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-primary-600 hover:text-primary-800">
              Home
            </Link>
            <Link
              to="/about"
              className="text-primary-600 hover:text-primary-800"
            >
              About
            </Link>
            <Link
              to="/classes"
              className="text-primary-600 hover:text-primary-800"
            >
              Classes
            </Link>
            <Link
              to="/pricing"
              className="text-primary-600 hover:text-primary-800"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-800"
            >
              Contact
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            ) : (
              <div className="relative group">
                <button className="flex items-center text-primary-600 hover:text-primary-800">
                  {user && user.name ? user.name.split(' ')[0] : 'Account'}
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
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {user && (user.role === 'instructor' || user.role === 'admin') && (
                    <Link
                      to="/teaching"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Classes
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-primary-600 hover:text-primary-800"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block py-2 px-3 text-primary-600 hover:text-primary-800"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/classes"
                className="block py-2 px-3 text-primary-600 hover:text-primary-800"
              >
                Classes
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="block py-2 px-3 text-primary-600 hover:text-primary-800"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 px-3 text-primary-600 hover:text-primary-800"
              >
                Contact
              </Link>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 