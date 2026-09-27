import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Server,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  BarChart3,
  Layers,
  FileCheck
} from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '4.5rem 0 5rem 0',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div className="public-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '3.5rem',
              alignItems: 'center'
            }}
            className="hero-grid"
          >
            {/* Left Hero Content */}
            <div style={{ maxWidth: '640px' }}>
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-accent-light)',
                  border: '1px solid #BFDBFE',
                  color: 'var(--color-accent)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem'
                }}
              >
                <Sparkles size={14} /> AI-Powered Operational Service Management
              </motion.div>

              <motion.h1
                variants={itemVariants}
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem'
                }}
              >
                Turn service requests into{' '}
                <span className="gradient-text">resolved problems.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '2rem'
                }}
              >
                Smart Service Management helps organizations receive, assign, track, and resolve service requests through one intelligent, audited platform.
              </motion.p>

              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  Get Started <ArrowRight size={17} />
                </Link>

                <Link
                  to="/how-it-works"
                  className="btn-outline"
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  Explore How It Works
                </Link>
              </motion.div>

              {/* Trust & Spec Indicators */}
              <motion.div
                variants={itemVariants}
                style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--color-success)" />
                  <span>Strict 3-Role Governance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="var(--color-accent)" />
                  <span>Sub-second AI Triage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={16} color="var(--color-warning)" />
                  <span>Complete Audit Trails</span>
                </div>
              </motion.div>
            </div>

            {/* Right Product Showcase Visual Card */}
            <motion.div
              variants={itemVariants}
              style={{ position: 'relative' }}
            >
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 20px 25px -5px rgba(15, 47, 107, 0.1), 0 8px 10px -6px rgba(15, 47, 107, 0.05)',
                  border: '1px solid #CBD5E1',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                {/* Mock Browser Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '1rem',
                    marginBottom: '1.25rem',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginLeft: '0.5rem', fontWeight: 500 }}>
                      smartservice.app / operations-center
                    </span>
                  </div>
                  <span className="badge badge-open">System Active</span>
                </div>

                {/* Showcase Live Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Queue</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>14 Tickets</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontSize: '0.7rem', color: '#1D4ED8', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)', marginTop: '0.2rem' }}>6 Resolving</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: '#ECFDF5', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#047857', textTransform: 'uppercase', fontWeight: 600 }}>Resolved Today</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669', marginTop: '0.2rem' }}>98.4% SLA</div>
                  </div>
                </div>

                {/* Ticket Item Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>TICK-1008</span>
                      <span className="badge badge-in_progress">IN_PROGRESS</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      Main Fiber Uplink Latency in Engineering Lab
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={12} /> Assigned: Alex Rivera (Staff)
                      </span>
                      <span>•</span>
                      <span style={{ color: 'var(--color-danger-text)', fontWeight: 600 }}>Priority: HIGH</span>
                    </div>
                  </div>

                  {/* AI Triage Banner in preview */}
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      border: '1px dashed var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <Sparkles size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                      <strong>AI Inference Engine:</strong> Auto-categorized as <em>Technical</em> with 88% confidence score.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="public-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Built For Enterprise Operations
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Engineered with Clear Operational Boundaries
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              A purpose-built service architecture designed to eliminate unassigned tickets, establish accountability, and prevent communication breakdown.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Card 1 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Strict Role Governance</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Service Requester (<strong>USER</strong>), Service Resolver (<strong>STAFF</strong>), and System Dispatcher (<strong>ADMIN</strong>). Creation flows belong exclusively to users, while resolution is managed by verified staff.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>5-State Lifecycle Progression</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Tickets transition strictly through: <code>PENDING</code> $\rightarrow$ <code>ASSIGNED</code> $\rightarrow$ <code>IN_PROGRESS</code> $\rightarrow$ <code>RESOLVED</code> $\rightarrow$ <code>CLOSED</code>. No skipped steps, invalid jumps, or lost tickets.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>AI-Powered Classification</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Natural language analysis automatically suggests ticket category, initial priority, and suggested handling department with built-in sub-1.5s fault-tolerant fallback execution.
              </p>
            </div>

            {/* Card 4 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#F5F3FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <FileCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Immutable Audit History</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every lifecycle action, staff assignment, ticket rejection with reason, status transition, and comment is permanently recorded in the database audit log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Experience Section */}
      <section
        style={{
          padding: '4.5rem 0',
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF'
        }}
      >
        <div className="public-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to streamline your service workflows?
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Experience modern service request intake, staff verification, ticket dispatching, and resolution management in one unified system.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn-primary"
              style={{
                backgroundColor: 'var(--color-accent)',
                padding: '0.8rem 1.75rem',
                fontSize: '1rem'
              }}
            >
              Create Requester Account <ArrowRight size={17} />
            </Link>
            <Link
              to="/login"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0.8rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
        }
      `}</style>
    </div>
  );
}
