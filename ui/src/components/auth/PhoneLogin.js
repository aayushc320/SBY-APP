import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import AlertMessage from '../common/AlertMessage';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  PhoneAuthProvider
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVMWdEn3QkdQ_c1cXpAkoS257D8Wz5-NM",
  authDomain: "strongbyyoga.com",
  projectId: "strongbyyoga",
  storageBucket: "strongbyyoga.appspot.com",
  messagingSenderId: "809995789251",
  appId: "1:809995789251:web:18520da28b9d0a2f999376",
  measurementId: "G-F68NMT99LR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const PhoneLogin = () => {
  const [step, setStep] = useState(1); // 1: Phone entry, 2: OTP verification
  const [formData, setFormData] = useState({
    countryCode: '+91',
    phoneNumber: '',
    otp: ''
  });
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  const { countryCode, phoneNumber, otp } = formData;

  useEffect(() => {
    // Setup invisible reCAPTCHA when component mounts
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          setAlert({ 
            type: 'error', 
            message: 'reCAPTCHA expired. Please try again.' 
          });
        }
      });
    }

    return () => {
      // Clean up recaptcha when component unmounts
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (alert) setAlert(null);
    if (error) clearError();
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!phoneNumber) {
      setAlert({ type: 'error', message: 'Please enter your phone number' });
      setIsLoading(false);
      return;
    }
    
    try {
      // Format phone number with country code
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      console.log('Requesting OTP for:', fullPhoneNumber);
      
      // Get the reCAPTCHA verification ID
      const appVerifier = window.recaptchaVerifier;
      
      // Sign in with phone number
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      
      // Move to OTP verification step
      setAlert({ type: 'success', message: 'Verification code sent successfully!' });
      setStep(2);
    } catch (err) {
      console.error('Error sending verification code:', err);
      setAlert({ 
        type: 'error', 
        message: `Failed to send verification code: ${err.message}` 
      });
      
      // Reset reCAPTCHA if there's an error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!otp) {
      setAlert({ type: 'error', message: 'Please enter the verification code' });
      setIsLoading(false);
      return;
    }
    
    try {
      if (!confirmationResult) {
        throw new Error('Verification session expired. Please request a new code.');
      }
      
      // Confirm the OTP code
      const result = await confirmationResult.confirm(otp);
      console.log('OTP verified successfully:', result);
      
      // Get the user's phone number and uid from Firebase
      const { user } = result;
      const phoneNumber = user.phoneNumber;
      const firebaseUid = user.uid;
      
      // Register/Login with the backend using Firebase credentials
      const response = await fetch('/api/auth/phone/firebase-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          firebaseUid
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with server');
      }
      
      const data = await response.json();
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error verifying code:', err);
      setAlert({ 
        type: 'error', 
        message: `Failed to verify code: ${err.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Reset reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
      
      // Format phone number with country code
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      // Get the reCAPTCHA verification ID
      const appVerifier = window.recaptchaVerifier;
      
      // Sign in with phone number again
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      
      setAlert({ type: 'success', message: 'Verification code resent successfully!' });
    } catch (err) {
      console.error('Error resending verification code:', err);
      setAlert({ 
        type: 'error', 
        message: `Failed to resend verification code: ${err.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Sign in with phone' : 'Enter verification code'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in with email
            </Link>
          </p>
        </div>
        
        {(alert || error) && (
          <AlertMessage
            type={alert ? alert.type : 'error'}
            message={alert ? alert.message : error}
            onClose={() => {
              setAlert(null);
              if (error) clearError();
            }}
          />
        )}
        
        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>
        
        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative inline-flex items-stretch flex-grow-0">
                  <select
                    id="countryCode"
                    name="countryCode"
                    className="appearance-none rounded-l-md relative block w-24 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={countryCode}
                    onChange={handleChange}
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+49">+49 (DE)</option>
                  </select>
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-r-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Phone number without country code"
                  value={phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send a verification code to this number
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={handleChange}
                  maxLength={6}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the 6-digit code sent to {countryCode} {phoneNumber}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                      'size': 'invisible'
                    });
                  }
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                disabled={isLoading}
              >
                Change phone number
              </button>
              <button
                type="button"
                onClick={resendOtp}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify and Sign In'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PhoneLogin; 