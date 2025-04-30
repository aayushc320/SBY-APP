import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const ProfilePicture = ({ user, setAlert }) => {
  const { updateUserDetails } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const avatarUrl = user.avatar && !user.avatar.includes('default.jpg') 
    ? `${axios.defaults.baseURL}/uploads/avatars/${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=200`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setAlert({
        type: 'error',
        message: 'Please select an image file (JPEG, PNG, GIF).'
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlert({
        type: 'error',
        message: 'Image file size should be less than 5MB.'
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setAlert({
        type: 'error',
        message: 'Please select an image file to upload.'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      
      const res = await axios.post('/api/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        setAlert({
          type: 'success',
          message: 'Profile picture updated successfully!'
        });
        
        // Clear selected file and preview
        setSelectedFile(null);
        setPreviewUrl(null);
        
        // Trigger parent component to refresh user data
        if (res.data.data && res.data.data.avatar) {
          await updateUserDetails({ avatar: res.data.data.avatar });
        }
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to update profile picture'
        });
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsLoading(true);
    
    try {
      const res = await axios.delete('/api/users/remove-avatar');
      
      if (res.data.success) {
        setAlert({
          type: 'success',
          message: 'Profile picture removed successfully!'
        });
        
        // Clear selected file and preview
        setSelectedFile(null);
        setPreviewUrl(null);
        
        // Trigger parent component to refresh user data
        await updateUserDetails({ avatar: 'default.jpg' });
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to remove profile picture'
        });
      }
    } catch (err) {
      console.error('Error removing profile picture:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Picture</h2>
      
      <div className="space-y-6">
        {/* Current Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative">
            <img 
              src={previewUrl || avatarUrl} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <p className="mt-4 text-gray-600 text-sm">
            {previewUrl ? 'Preview of new profile picture' : 'Current profile picture'}
          </p>
        </div>
        
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload New Picture
            </label>
            <div className="mt-2 flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Select Image
              </button>
              {selectedFile && (
                <span className="ml-4 text-sm text-gray-600">
                  {selectedFile.name}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              JPG, PNG, or GIF. Maximum size of 5MB.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {!user.avatar.includes('default.jpg') && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Remove Picture
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Uploading...' : 'Upload Picture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePicture; 