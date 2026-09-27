import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  UserCheck,
  AlertTriangle,
  GitBranch,
  MessageSquare,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Services() {
  const services = [
    {
      id: 'request-intake',
      title: '1. Service Request Management',
      icon: <FileText size={26} color="var(--color-accent)" />,
      badge: 'USER Role',
      description: 'Structured intake portal allowing requesters to detail operational issues, specify physical location, designate department, and upload diagnostic attachments.',
      visualDetails: ['Sequential ticket numbering (TICK-XXXX)', 'Location and Department tagging', 'Exclusively authorized for USER role']
    },
    {
      id: 'ticket-tracking',
      title: '2. Real-Time Ticket Tracking',
      icon: <Search size={26} color="#059669" />,
      badge: 'All Roles',
      description: 'Instant status transparency across the organization. Requesters and staff can search, filter by category/priority, and track active tickets through sequential milestones.',
      visualDetails: ['Real-time status badges', 'Filter by status, category & priority', 'Timestamped lifecycle updates']
    },
    {
      id: 'staff-assignment',
      title: '3. Staff Assignment & Dispatch',
      icon: <UserCheck size={26} color="#D97706" />,
      badge: 'ADMIN & STAFF',
      description: 'Centralized queue distribution allowing administrators to dispatch tickets to active staff members, with self-claiming for support specialists and structured rejection handling.',
      visualDetails: ['Global unassigned queue management', 'One-click staff dispatching', 'Mandatory rejection reason capture']
    },
    {
      id: 'priority-management',
      title: '4. Priority & SLA Management',
      icon: <AlertTriangle size={26} color="#DC2626" />,
      badge: 'Configurable',
      description: 'Multilevel priority classification (LOW, MEDIUM, HIGH, URGENT) that flags critical infrastructure outages, ensuring high-urgency incidents receive rapid staff intervention.',
      visualDetails: ['Visual color-coded severity badges', 'URGENT priority escalation flags', 'Resolution SLA compliance tracking']
    },
    {
      id: 'status-tracking',
      title: '5. Sequential Status Tracking',
      icon: <GitBranch size={26} color="#7C3AED" />,
      badge: '5-State Model',
      description: 'Controlled sequential status progression: PENDING -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED. Protects against accidental status skips and validates all transitions.',
      visualDetails: ['Strict transition state machine', 'Resolution notes required for RESOLVED', 'Requester approval required for CLOSED']
    },
    {
      id: 'comments-communication',
      title: '6. Communication & Commenting',
      icon: <MessageSquare size={26} color="#2563EB" />,
      badge: 'Audited Thread',
      description: 'Threaded, timestamped communication directly attached to the ticket record. Keeps requesters, staff engineers, and managers aligned without disjointed external chat chains.',
      visualDetails: ['Threaded conversation timeline', 'Role badges for every comment author', 'Permanent database persistence']
    },
    {
      id: 'analytics-reporting',
      title: '7. Analytics & System Reporting',
      icon: <BarChart3 size={26} color="#0F2F6B" />,
      badge: 'ADMIN Analytics',
      description: 'Operational analytics dashboards with MongoDB aggregation pipelines providing real-time data on volume trends, staff workload, category distributions, and average resolution times.',
      visualDetails: ['Dynamic timeframe filters (Day, Week, Month)', 'Staff workload distribution metrics', 'Average resolution time analytics']
    },
    {
      id: 'ai-classification',
      title: '8. AI-Assisted Ticket Classification',
      icon: <Sparkles size={26} color="#9333EA" />,
      badge: 'Sub-second AI',
      description: 'Intelligent natural language classifier that evaluates problem descriptions upon ticket creation to automatically infer appropriate category, initial priority, and suggested handling department.',
      visualDetails: ['Confidence score calculation', 'Sub-1.5s fault-tolerant fallback', 'Editable recommendations before submit']
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
              Platform Solutions
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
              8 Core Services Powering Modern Support Operations
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}
            >
              Every capability within Smart Service Management is purposefully designed to organize service requests, eliminate ambiguity, and maintain reliable audit records.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="public-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem'
            }}
          >
            {services.map((s) => (
              <div
                key={s.id}
                className="card service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '2rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {s.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: '#F1F5F9',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      {s.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {s.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}
                  >
                    {s.description}
                  </p>
                </div>

                {/* Visual Details Box */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Key Implementation Features
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.825rem',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {s.visualDetails.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <CheckCircle2 size={14} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '4rem',
              textAlign: 'center',
              padding: '2.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Want to see these solutions in action?
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Inspect our step-by-step interactive workflow or sign in to test the live service management environment.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/how-it-works" className="btn-primary">
                View How It Works <ArrowRight size={16} />
              </Link>
              <Link to="/features" className="btn-outline">
                Explore Detailed Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: #BFDBFE !important;
        }
      `}</style>
    </div>
  );
}
