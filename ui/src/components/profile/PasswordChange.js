import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const PasswordChange = ({ setAlert }) => {
  const { updatePassword } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Password must be at least 6 characters
    if (newPassword.length < 6) {
      setAlert({
        type: 'error',
        message: 'New password must be at least 6 characters'
      });
      return false;
    }

    // Passwords must match
    if (newPassword !== confirmPassword) {
      setAlert({
        type: 'error',
        message: 'Passwords do not match'
      });
      return false;
    }

    // Current and new password should be different
    if (currentPassword === newPassword) {
      setAlert({
        type: 'error',
        message: 'New password must be different from current password'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await updatePassword({
        currentPassword,
        newPassword
      });
      
      if (result.success) {
        setAlert({
          type: 'success',
          message: 'Password changed successfully!'
        });
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setAlert({
          type: 'error',
          message: result.message || 'Failed to change password'
        });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/\d/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const strengthColor = (strength) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strengthLabel = (strength) => {
    if (strength <= 1) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  const strength = passwordStrength(newPassword);
  const strengthBarWidth = `${(strength / 5) * 100}%`;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            minLength={6}
          />
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${strengthColor(strength)}`} 
                    style={{ width: strengthBarWidth }}
                  ></div>
                </div>
                <span className="ml-4 text-xs text-gray-600 w-16">{strengthLabel(strength)}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                For a stronger password, include uppercase letters, numbers, and special characters.
              </p>
            </div>
          )}
        </div>
        
        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange; 