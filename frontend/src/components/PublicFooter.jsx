import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Mail, MapPin, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-primary)',
        color: '#F8FAFC',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem'
      }}
    >
      <div className="public-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)'
                }}
              >
                <Server size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                  Smart Service
                </div>
                <div style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 600, letterSpacing: '0.05em' }}>
                  MANAGEMENT
                </div>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              An intelligent, full-stack service request and support management system built for structured ticket lifecycle tracking, role-based operations, and automated AI classification.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6EE7B7', fontSize: '0.8rem', fontWeight: 500, backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '0.35rem 0.75rem', borderRadius: '9999px' }}>
              <ShieldCheck size={14} /> Production-Grade RBAC Architecture
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: '#CBD5E1' }}>Home</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#CBD5E1' }}>About Platform</Link>
              </li>
              <li>
                <Link to="/how-it-works" style={{ color: '#CBD5E1' }}>How It Works</Link>
              </li>
              <li>
                <Link to="/features" style={{ color: '#CBD5E1' }}>Features & Specs</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: '#CBD5E1' }}>Solutions & Workflows</Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Workflows */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Key Workflows
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/services" style={{ color: '#CBD5E1' }}>Request Intake & Tracking</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: '#CBD5E1' }}>AI Ticket Classification</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: '#CBD5E1' }}>Staff Dispatch & Claiming</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: '#CBD5E1' }}>Accept / Reject Workflow</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: '#CBD5E1' }}>Operational Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Project & Support Contact */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Support & Location
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={17} color="#60A5FA" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <span>Enterprise Service Center, Operational Tech Campus (Demo Facility)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>support@smartservice.demo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Clock size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>Mon – Fri: 08:00 – 18:00 Local</span>
              </div>
              <Link
                to="/location"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: '#93C5FD',
                  fontWeight: 600,
                  marginTop: '0.25rem'
                }}
              >
                View Facility Location <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider & Sub-footer */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#94A3B8'
          }}
        >
          <div>
            © {currentYear} Smart Service Management. All rights reserved. Professional Service Management System.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#94A3B8' }}>Architecture</Link>
            <Link to="/contact" style={{ color: '#94A3B8' }}>Contact Support</Link>
            <Link to="/login" style={{ color: '#94A3B8' }}>Staff / Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
