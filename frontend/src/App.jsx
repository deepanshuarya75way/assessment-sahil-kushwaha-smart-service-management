import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import HowItWorks from './pages/public/HowItWorks';
import Features from './pages/public/Features';
import Contact from './pages/public/Contact';
import Location from './pages/public/Location';

// Authentication Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Authenticated Application Pages
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import StaffWorkspace from './pages/StaffWorkspace';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Marketing Website (Wrapped in PublicLayout) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/location" element={<Location />} />
          </Route>

          {/* Authentication Routes (Public) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Client/Requester Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
                <TicketDetail />
              </ProtectedRoute>
            }
          />

          {/* Protected Staff & Admin Routes */}
          <Route
            path="/staff/workspace"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <StaffWorkspace />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Only Routes */}
          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect to Public Homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
