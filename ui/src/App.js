import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PhoneLogin from './components/auth/PhoneLogin';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import PrivateRoute from './components/routing/PrivateRoute';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Classes from './pages/Classes';
import About from './pages/About';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ClassManagement from './pages/admin/ClassManagement';
import CreditManagement from './pages/admin/CreditManagement';

// No need to set axios base URL here as it's already set in AuthContext

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="classes" element={<Classes />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="phone-login" element={<PhoneLogin />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          
            {/* Protected Routes */}
            <Route 
              path="dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<div className="container-custom py-16">404 Not Found</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
          <Route path="admin/users" element={<PrivateRoute adminOnly={true}><UserManagement /></PrivateRoute>} />
          <Route path="admin/classes" element={<PrivateRoute adminOnly={true}><ClassManagement /></PrivateRoute>} />
          <Route path="admin/credits" element={<PrivateRoute adminOnly={true}><CreditManagement /></PrivateRoute>} />
          <Route path="admin/content" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
          <Route path="admin/subscriptions" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
          <Route path="admin/settings" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
          <Route path="admin/integrations" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
          <Route path="admin/notifications" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
