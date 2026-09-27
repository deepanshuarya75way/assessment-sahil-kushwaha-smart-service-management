import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Server, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email.trim() || !password) {
      setFormError('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      // Role-Based Routing
      if (result.user.role === 'ADMIN') {
        navigate('/admin/panel');
      } else if (result.user.role === 'STAFF') {
        navigate('/staff/workspace');
      } else {
        navigate('/dashboard');
      }
    } else {
      setFormError(result.error);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #F0F6FF 0%, #F8FAFC 50%, #EEF4FF 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Ambient Background Decorative Accents */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(240, 246, 255, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          right: '12%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 47, 107, 0.06) 0%, rgba(240, 246, 255, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Simple Brand Bar */}
      <header
        style={{
          padding: '1.15rem 2rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Server size={18} color="var(--color-accent)" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>
            Smart Service Management
          </span>
        </Link>
      </header>

      {/* Main Authentication Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Sign In to Your Workspace
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Access your service requests, staff queue, or dispatcher panel
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '2.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px -5px rgba(15, 47, 107, 0.08), 0 8px 10px -6px rgba(15, 47, 107, 0.03)'
            }}
          >
            {formError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-danger-light)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-danger-text)',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  lineHeight: 1.5
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.5rem 0.65rem 2.4rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.6rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--color-border)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Demo Fill:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('user@example.com', 'UserPassword123!')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', borderRadius: '4px', border: '1px solid #BFDBFE' }}
                >
                  Requester (User)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('staff@example.com', 'StaffPassword123!')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: '#ECFDF5', color: '#047857', borderRadius: '4px', border: '1px solid #A7F3D0' }}
                >
                  Resolver (Staff)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin@example.com', 'AdminPassword123!')}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '4px', border: '1px solid #FECACA' }}
                >
                  Dispatcher (Admin)
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                Register here
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
