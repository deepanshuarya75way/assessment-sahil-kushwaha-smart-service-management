import React from 'react';
import { Link } from 'react-router-dom';
import {
  Server,
  Shield,
  Users,
  Target,
  CheckCircle2,
  Workflow,
  Sparkles,
  ArrowRight,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';

export default function About() {
  return (
    <div>
      {/* Header Banner */}
      <section
        style={{
          padding: '4rem 0 3rem 0',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="public-container">
          <div style={{ maxWidth: '780px' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              About The Platform
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                color: 'var(--color-primary)',
                marginTop: '0.5rem',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}
            >
              Intelligent Service Delivery Built for Structure and Speed
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}
            >
              Smart Service Management is an enterprise-grade platform designed to streamline the lifecycle of internal and customer service requests, eliminating lost inquiries and operational bottlenecks.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem We Solve & Why Centralization Matters */}
      <section className="section-padding">
        <div className="public-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                The Core Challenge
              </span>
              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginTop: '0.4rem',
                  marginBottom: '1rem'
                }}
              >
                Why Centralized Service Management Matters
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Without a unified system, organizations rely on fragmented email chains, chat pings, and informal requests. This creates three critical failures:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem' }}>✕</div>
                  <span style={{ fontSize: '0.925rem', color: 'var(--color-text-primary)' }}>
                    <strong>Untracked Requests:</strong> Inquiries get buried in personal inboxes without sequential numbering or owner tracking.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem' }}>✕</div>
                  <span style={{ fontSize: '0.925rem', color: 'var(--color-text-primary)' }}>
                    <strong>Unclear Accountability:</strong> Support technicians lack visibility into who is actively working on an issue versus who rejected the assignment.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.75rem' }}>✕</div>
                  <span style={{ fontSize: '0.925rem', color: 'var(--color-text-primary)' }}>
                    <strong>Zero Operational Visibility:</strong> Managers cannot reliably measure resolution times, staff workload distributions, or recurring equipment faults.
                  </span>
                </li>
              </ul>
            </div>

            <div
              className="card"
              style={{
                padding: '2.25rem',
                backgroundColor: '#FFFFFF',
                borderLeft: '5px solid var(--color-accent)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                How Smart Service Management Solves This
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                By establishing a single source of truth, every inquiry receives a unique sequential identifier (e.g. <code>TICK-1001</code>), enters a verified status pipeline, and tracks complete timestamped history logs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Real-time requester visibility into ticket resolution progress</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Sub-second AI classification for priority and department triage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Mandatory rejection reasons with automatic admin notifications</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  <span>Interactive resolution confirmation by the original requester</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How The Three Roles Interact */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-border)' }}>
        <div className="public-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Interaction Model
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.4rem', marginBottom: '0.75rem' }}>
              How Users, Staff, and Admins Collaborate
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              The platform enforces clear separation of concerns across three distinct user roles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* User Box */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>USER</h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)' }}>Service Requester</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                The only role permitted to create new service requests. Users describe issues, select categories/locations, receive AI categorization suggestions, and confirm resolution before closing tickets.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <strong>Key Capability:</strong> Service ticket submission, comment updates, and resolution closure confirmation.
              </div>
            </div>

            {/* Staff Box */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>STAFF</h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706' }}>Service Resolver</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Support specialists and department engineers who resolve assigned issues. Staff accounts require verification before activation. Staff can accept or reject assignments, add comments, and enter resolution notes.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <strong>Key Capability:</strong> Accept/reject workflow, status transition to IN_PROGRESS & RESOLVED, resolution documentation.
              </div>
            </div>

            {/* Admin Box */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>ADMIN</h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B91C1C' }}>System Manager / Dispatcher</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Single centralized administrator overseeing operational queues, staff dispatching, user account management, staff verification approvals, and organizational analytics metrics.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <strong>Key Capability:</strong> Global ticket queue reassignment, verification reviews, system statistics, and account status control.
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/how-it-works" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              See Visual Workflow Steps <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
