import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'OAUTH_SUCCESS':
    case 'PHONE_VERIFY_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'OAUTH_FAIL':
    case 'PHONE_VERIFY_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in headers for every request
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/auth/me');
          dispatch({ type: 'USER_LOADED', payload: res.data.data });
        } catch (err) {
          dispatch({ 
            type: 'AUTH_ERROR', 
            payload: err.response?.data?.error || 'Authentication error' 
          });
        }
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUser();
  }, []);

  // Register user with email/password
  const register = async (formData) => {
    console.log('Registering user:', { ...formData, password: '***REDACTED***' });
    try {
      const res = await axios.post('/auth/register', formData);
      console.log('Registration successful:', res.data);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed';
      
      if (err.response) {
        // Server responded with an error
        errorMessage = err.response.data?.error || 
                      `Server error: ${err.response.status}`;
        console.error('Server response error:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        console.error('No response error:', err.request);
      } else {
        // Error setting up the request
        errorMessage = err.message || errorMessage;
        console.error('Request setup error:', err.message);
      }
      
      dispatch({
        type: 'REGISTER_FAIL',
        payload: errorMessage,
      });
    }
  };

  // Login with email/password
  const login = async (formData) => {
    console.log('Logging in user:', { ...formData, password: '***REDACTED***' });
    try {
      const res = await axios.post('/auth/login', formData);
      console.log('Login successful');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed';
      
      if (err.response) {
        // Server responded with an error
        errorMessage = err.response.data?.error || 
                      `Server error: ${err.response.status}`;
        console.error('Server response error:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
        console.error('No response error:', err.request);
      } else {
        // Error setting up the request
        errorMessage = err.message || errorMessage;
        console.error('Request setup error:', err.message);
      }
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  };

  // Request OTP for phone login
  const requestPhoneOtp = async (phoneNumber, countryCode = '+1') => {
    console.log(`Requesting OTP for ${countryCode} ${phoneNumber}`);
    try {
      const res = await axios.post('/api/auth/phone/request-otp', { 
        phoneNumber, 
        countryCode 
      });
      return { 
        success: true, 
        message: res.data.message,
        otp: res.data.otp // Will be undefined in production
      };
    } catch (err) {
      console.error('OTP request error:', err);
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to send OTP' 
      };
    }
  };

  // Verify OTP and login
  const verifyPhoneOtp = async (phoneNumber, otp) => {
    try {
      const res = await axios.post('/api/auth/phone/verify-otp', { phoneNumber, otp });
      dispatch({
        type: 'PHONE_VERIFY_SUCCESS',
        payload: res.data,
      });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Invalid OTP';
      console.error('OTP verification error:', errorMessage);
      dispatch({
        type: 'PHONE_VERIFY_FAIL',
        payload: errorMessage,
      });
      return false;
    }
  };

  // Google OAuth login
  const googleLogin = async (idToken) => {
    try {
      const res = await axios.post('/auth/google', { idToken });
      dispatch({
        type: 'OAUTH_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'OAUTH_FAIL',
        payload: err.response?.data?.error || 'Google authentication failed',
      });
    }
  };

  // Facebook OAuth login
  const facebookLogin = async (accessToken) => {
    try {
      const res = await axios.post('/auth/facebook', { accessToken });
      dispatch({
        type: 'OAUTH_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'OAUTH_FAIL',
        payload: err.response?.data?.error || 'Facebook authentication failed',
      });
    }
  };

  // Apple OAuth login
  const appleLogin = async (idToken, user) => {
    try {
      const res = await axios.post('/auth/apple', { idToken, user });
      dispatch({
        type: 'OAUTH_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'OAUTH_FAIL',
        payload: err.response?.data?.error || 'Apple authentication failed',
      });
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to process password reset' 
      };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const res = await axios.put(`/auth/reset-password/${token}`, { password });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to reset password' 
      };
    }
  };

  // Update user details
  const updateUserDetails = async (userData) => {
    try {
      const res = await axios.put('/auth/update-details', userData);
      dispatch({
        type: 'UPDATE_USER',
        payload: res.data.data,
      });
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to update profile' 
      };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      const res = await axios.put('/auth/update-password', passwordData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to update password' 
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      console.log('Attempting to logout user');
      const res = await axios.post('/auth/logout');
      console.log('Server logout successful:', res.data);
    } catch (err) {
      let errorMessage = 'Logout from server failed';
      
      if (err.response) {
        // Server responded with an error
        errorMessage = `Server logout error: ${err.response.status}`;
        console.error('Server logout error:', err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server during logout';
        console.error('No server response during logout:', err.request);
      } else {
        // Error setting up the request
        errorMessage = `Logout request error: ${err.message}`;
        console.error('Logout request setup error:', err.message);
      }
      
      console.warn(errorMessage, '- proceeding with client-side logout anyway');
    } finally {
      // Always perform client-side logout regardless of server response
      dispatch({ type: 'LOGOUT' });
      console.log('Client-side logout completed');
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        clearError,
        requestPhoneOtp,
        verifyPhoneOtp,
        googleLogin,
        facebookLogin,
        appleLogin,
        forgotPassword,
        resetPassword,
        updateUserDetails,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 