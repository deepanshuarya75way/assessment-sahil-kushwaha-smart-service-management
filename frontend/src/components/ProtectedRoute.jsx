import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          Loading session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg)', padding: '1rem' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>403 Access Forbidden</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Your role (<strong>{user.role}</strong>) does not have authorization to access this page.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}
