import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Ticket,
  UserCheck,
  History,
  MessageSquare,
  Sparkles,
  BarChart3,
  Search,
  Layout,
  Clock,
  GitCommit,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Role-Based Access Control (RBAC)',
      icon: <Shield size={24} color="var(--color-primary)" />,
      badge: 'Core Security',
      description: 'Strict security boundaries dividing USER, STAFF, and ADMIN. Backend middleware and controller guards verify tokens and block unauthorized endpoint executions.',
      specs: ['JWT Bearer authentication', 'Controller-level authorization guards', 'Role-specific workspace views']
    },
    {
      title: 'Secure Authentication & Verification',
      icon: <Lock size={24} color="#059669" />,
      badge: 'Bcrypt + JWT',
      description: 'Bcrypt salted password hashing, 24-hour expiration JWT tokens, and identity document verification for support staff applicants before account activation.',
      specs: ['Private staff ID document storage', 'Soft account deactivation support', 'Zero plaintext password exposure']
    },
    {
      title: 'Intelligent Ticket Management',
      icon: <Ticket size={24} color="var(--color-accent)" />,
      badge: 'Sequential IDs',
      description: 'Every ticket receives an immutable sequential number (TICK-1001, TICK-1002). Requesters provide physical office location, department, and file attachments.',
      specs: ['Collision-proof ticket numbering', 'Department and location metadata', 'Exclusively authorized for USER role']
    },
    {
      title: 'Staff Assignment & Claiming',
      icon: <UserCheck size={24} color="#D97706" />,
      badge: 'Workload Dispatch',
      description: 'Administrators assign tickets to active staff with a single click. Staff members can accept assignments or submit structured rejections with mandatory reasons.',
      specs: ['Real-time unassigned queue visibility', 'Interactive Staff Accept/Reject workflow', 'Rejection reason logged to admin panel']
    },
    {
      title: 'Immutable Ticket History Audit',
      icon: <History size={24} color="#7C3AED" />,
      badge: 'Compliance Audit',
      description: 'The TicketHistory audit collection records every action, status transition, assignment change, rejection, and resolution timestamp alongside author metadata.',
      specs: ['Action, previousValue, newValue tracking', 'Actor attribution on all changes', 'Chronological timeline visualization']
    },
    {
      title: 'Threaded Ticket Comments',
      icon: <MessageSquare size={24} color="#2563EB" />,
      badge: 'Communication',
      description: 'Centralized collaboration thread attached directly to the ticket. Requesters, support technicians, and administrators communicate transparently without lost emails.',
      specs: ['Role badges on each message', 'Persistent MongoDB thread storage', 'Chronological message display']
    },
    {
      title: 'AI Ticket Classification Engine',
      icon: <Sparkles size={24} color="#9333EA" />,
      badge: 'Sub-second AI',
      description: 'Natural language analysis infers category, priority (LOW to URGENT), and department in milliseconds, accompanied by a 1.5s fault-tolerant heuristic fallback.',
      specs: ['Confidence score calculation', 'Real-time interactive review modal', 'Zero blocking failure modes']
    },
    {
      title: 'Operational Analytics & Metrics',
      icon: <BarChart3 size={24} color="#0F2F6B" />,
      badge: 'MongoDB Pipelines',
      description: 'Comprehensive administrative intelligence powered by aggregation pipelines: ticket distributions by category, priority breakdown, staff workloads, and average resolution hours.',
      specs: ['Filter by Day, Week, Month or All Time', 'Staff workload balance tracking', 'Average resolution time computation']
    },
    {
      title: 'Real-Time Search & Filtering',
      icon: <Search size={24} color="#059669" />,
      badge: 'Queue Speed',
      description: 'Instant client-side and server-side filtering across tickets by ticket number, title, category, priority, and status without page refreshes.',
      specs: ['Keyword search across titles & IDs', 'Multi-attribute filter dropdowns', 'Quick filter counter badges']
    },
    {
      title: 'Responsive SaaS Dashboard',
      icon: <Layout size={24} color="#D97706" />,
      badge: 'Design System',
      description: 'Crafted with Deep Navy (#0F2F6B) and Accent Blue (#3B82F6) design tokens. Fully responsive across desktop, tablet, and mobile displays with clean cards and typography.',
      specs: ['Mobile drawer navigation', 'Accessible high-contrast typography', 'CSS variable design token system']
    },
    {
      title: 'Activity Timeline & Event Stream',
      icon: <Clock size={24} color="#2563EB" />,
      badge: 'Event Tracking',
      description: 'Interactive visual timeline displaying submission date, staff claims, acceptances, rejections, comments, and resolution confirmation in unified sequence.',
      specs: ['Visual status icons along timeline', 'Timestamped milestone entries', 'Resolution notes display']
    },
    {
      title: 'Controlled Status Tracking',
      icon: <GitCommit size={24} color="#DC2626" />,
      badge: '5-State Model',
      description: 'Guaranteed sequential progression through PENDING -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED. The system blocks invalid jumps and protects data integrity.',
      specs: ['Invalid transition rejection (400)', 'Resolution notes required for RESOLVED', 'Requester approval required for CLOSED']
    }
  ];

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
              System Capabilities
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
              Enterprise-Grade Features & Specifications
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}
            >
              Discover the complete set of architectural, operational, and security capabilities engineered into Smart Service Management.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section-padding">
        <div className="public-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {f.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: '#F1F5F9',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '0.65rem'
                    }}
                  >
                    {f.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {f.description}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem'
                  }}
                >
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {f.specs.map((spec, sIdx) => (
                      <li key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={13} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              marginTop: '4rem',
              textAlign: 'center',
              padding: '2.5rem',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Built for production-ready service governance
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
              All 12 enterprise features are fully implemented, verified with end-to-end regression tests, and active in this workspace.
            </p>
            <Link
              to="/register"
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              Get Started with Smart Service <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
