import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Ticket, Users, Shield, LogOut, BarChart3, CheckSquare } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', textDecoration: 'none' }}>
          <Server size={24} color="var(--color-accent)" />
          <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>Smart Service Management</span>
        </Link>

        {/* Navigation Tabs based on Role */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: isActive('/dashboard') ? '#fff' : 'rgba(255,255,255,0.7)',
              backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.15)' : 'transparent',
              textDecoration: 'none'
            }}
          >
            <Ticket size={16} /> My Tickets
          </Link>

          {['STAFF', 'ADMIN'].includes(user?.role) && (
            <Link
              to="/staff/workspace"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isActive('/staff/workspace') ? '#fff' : 'rgba(255,255,255,0.7)',
                backgroundColor: isActive('/staff/workspace') ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none'
              }}
            >
              <CheckSquare size={16} /> Staff Queue
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: isActive('/admin/panel') ? '#fff' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive('/admin/panel') ? 'rgba(255,255,255,0.15)' : 'transparent',
                  textDecoration: 'none'
                }}
              >
                <Shield size={16} /> Admin Panel
              </Link>

              <Link
                to="/admin/analytics"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: isActive('/admin/analytics') ? '#fff' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive('/admin/analytics') ? 'rgba(255,255,255,0.15)' : 'transparent',
                  textDecoration: 'none'
                }}
              >
                <BarChart3 size={16} /> Analytics
              </Link>
            </>
          )}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600 }}>{user?.name}</span>
          <span className={`badge badge-${user?.role === 'ADMIN' ? 'danger' : user?.role === 'STAFF' ? 'warning' : 'open'}`}>
            {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  );
}
