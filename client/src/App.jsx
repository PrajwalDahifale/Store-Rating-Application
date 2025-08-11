import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/login';
import Signup from './pages/Signup';
import StoreList from './pages/Storelist';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUser';
import AdminStores from './pages/AdminStores';
import OwnerDashboard from './pages/OwnerDashboard';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import StoreRating from './pages/StoreRating';
function App() {
  return (
    <AuthProvider>
      
        
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<StoreList />} />

          {/* Protected Routes */}
          <Route path="/stores" element={
            <ProtectedRoute>
              <StoreList />
            </ProtectedRoute>
          } />

<Route path="/owner/store/:id" element={<StoreRating />} />
<Route path="/change-password" element={<ChangePassword />} />
          {/*  */}

          {/* Admin Only */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute roles={['admin']}>
              <AdminStores />
            </ProtectedRoute>
          } />

          {/* Owner Only */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute roles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;
