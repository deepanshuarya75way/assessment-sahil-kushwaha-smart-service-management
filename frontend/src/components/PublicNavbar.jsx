import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Menu, X, ArrowRight, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Features', path: '/features' },
    { label: 'Location', path: '/location' },
    { label: 'Contact', path: '/contact' }
  ];

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'ADMIN') return '/admin/panel';
    if (user.role === 'STAFF') return '/staff/workspace';
    return '/dashboard';
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        className="public-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 4px rgba(15, 47, 107, 0.2)'
            }}
          >
            <Server size={22} color="var(--color-accent)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Smart Service
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.25rem'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive(link.path) ? 600 : 500,
                color: isActive(link.path) ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: isActive(link.path) ? 'var(--color-accent-light)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth Status */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem'
          }}
          className="desktop-auth"
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => navigate(getDashboardPath())}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                <LayoutDashboard size={16} /> Open Workspace
              </button>
              <button
                onClick={logout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1.15rem' }}
              >
                Get Started <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
          className="animate-fade-in"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: isActive(link.path) ? 600 : 500,
                color: isActive(link.path) ? 'var(--color-accent)' : 'var(--color-text-primary)',
                backgroundColor: isActive(link.path) ? 'var(--color-accent-light)' : 'transparent'
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LayoutDashboard size={18} /> Open Workspace
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive Inline CSS for Navbar elements */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
