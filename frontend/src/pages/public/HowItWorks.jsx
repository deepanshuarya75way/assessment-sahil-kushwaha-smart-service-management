import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FilePlus,
  Sparkles,
  Send,
  CheckCircle2,
  Eye,
  UserCheck,
  Activity,
  Check,
  Wrench,
  FileText,
  CheckSquare,
  Lock,
  ArrowDown,
  ArrowRight
} from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('ALL');

  const workflowSteps = [
    {
      actor: 'USER',
      stage: 'Phase 1: Ticket Creation & AI Triage',
      title: '1. Create Service Request',
      icon: <FilePlus size={22} color="var(--color-accent)" />,
      badge: 'PENDING',
      description: 'The requester describes the problem, inputs physical location (office, floor, lab), and specifies the affected department.',
      subSteps: [
        'User enters problem summary and detailed description',
        'Optional diagnostic attachment can be included'
      ]
    },
    {
      actor: 'USER',
      stage: 'Phase 1: Ticket Creation & AI Triage',
      title: '2. Real-Time AI Classification',
      icon: <Sparkles size={22} color="#9333EA" />,
      badge: 'AI ENGINE',
      description: 'The AI model evaluates the text, calculates confidence score, and suggests category, initial priority, and routing department.',
      subSteps: [
        'Natural language categorization (Hardware, Software, Facilities, etc.)',
        'Sub-1.5s execution with built-in rule-based fallback'
      ]
    },
    {
      actor: 'USER',
      stage: 'Phase 1: Ticket Creation & AI Triage',
      title: '3. Review, Finalize & Submit',
      icon: <Send size={22} color="#2563EB" />,
      badge: 'SUBMISSION',
      description: 'The user reviews AI suggestions, makes any manual adjustments if desired, and confirms submission.',
      subSteps: [
        'User retains final authority to override AI recommendation',
        'Sequential ticket number is reserved (e.g. TICK-1002)'
      ]
    },
    {
      actor: 'ADMIN',
      stage: 'Phase 2: Administrative Review & Dispatch',
      title: '4. Administrative Queue Review',
      icon: <Eye size={22} color="#B91C1C" />,
      badge: 'PENDING',
      description: 'The System Administrator inspects the unassigned ticket queue, reviewing severity and affected departments.',
      subSteps: [
        'Admin evaluates current staff workload across departments',
        'High-urgency incidents flagged for immediate routing'
      ]
    },
    {
      actor: 'ADMIN',
      stage: 'Phase 2: Administrative Review & Dispatch',
      title: '5. Staff Assignment',
      icon: <UserCheck size={22} color="#D97706" />,
      badge: 'ASSIGNED',
      description: 'Admin dispatches the ticket to a verified staff member. Ticket status automatically advances to ASSIGNED.',
      subSteps: [
        'Target staff member is bound to ticket.assignedTo',
        'Audit entry STAFFF_ASSIGNED logged in TicketHistory'
      ]
    },
    {
      actor: 'STAFF',
      stage: 'Phase 3: Staff Investigation & Resolution',
      title: '6. Accept or Reject Assignment',
      icon: <Check size={22} color="#059669" />,
      badge: 'ACCEPT / REJECT',
      description: 'The assigned staff member inspects the ticket details and either ACCEPTS or REJECTS the assignment.',
      subSteps: [
        'If ACCEPTED: Ticket advances to IN_PROGRESS',
        'If REJECTED: Mandatory rejection reason required; returns to PENDING with admin alert'
      ]
    },
    {
      actor: 'STAFF',
      stage: 'Phase 3: Staff Investigation & Resolution',
      title: '7. Investigation & Status Updates',
      icon: <Wrench size={22} color="#2563EB" />,
      badge: 'IN_PROGRESS',
      description: 'Staff troubleshoots the issue on-site or remotely, maintaining continuous threaded comments with the requester.',
      subSteps: [
        'Staff updates internal progress notes and user comments',
        'All updates timestamped in ticket timeline'
      ]
    },
    {
      actor: 'STAFF',
      stage: 'Phase 3: Staff Investigation & Resolution',
      title: '8. Document Resolution Notes & Mark Resolved',
      icon: <CheckSquare size={22} color="#059669" />,
      badge: 'RESOLVED',
      description: 'Upon completing the technical work, staff enters comprehensive resolution notes and transitions status to RESOLVED.',
      subSteps: [
        'Mandatory resolution summary explaining how the issue was fixed',
        'Status advances to RESOLVED; requester notified to inspect'
      ]
    },
    {
      actor: 'USER',
      stage: 'Phase 4: Customer Verification & Closure',
      title: '9. Requester Review & Final Closure',
      icon: <Lock size={22} color="var(--color-primary)" />,
      badge: 'CLOSED',
      description: 'The original requester verifies the service outcome and marks the ticket CLOSED to complete the lifecycle.',
      subSteps: [
        'Requester confirms satisfactory resolution',
        'Ticket lifecycle successfully finalized in permanent audit database'
      ]
    }
  ];

  const filteredSteps = activeTab === 'ALL'
    ? workflowSteps
    : workflowSteps.filter(s => s.actor === activeTab);

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
              System Workflow Stepper
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
              The End-to-End Service Lifecycle
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}
            >
              See exactly how service requests move from submission through AI categorization, administrative dispatch, staff resolution, and requester closure.
            </p>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {['ALL', 'USER', 'ADMIN', 'STAFF'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: activeTab === tab ? 'var(--color-primary)' : '#FFFFFF',
                    color: activeTab === tab ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  {tab === 'ALL' ? 'Complete Workflow (All Roles)' : `${tab} Steps Only`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline Stepper */}
      <section className="section-padding">
        <div className="public-container" style={{ maxWidth: '860px' }}>
          <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
            {/* Vertical Connecting Line */}
            <div
              style={{
                position: 'absolute',
                left: '19px',
                top: '20px',
                bottom: '40px',
                width: '3px',
                backgroundColor: '#E2E8F0',
                borderRadius: '2px'
              }}
            />

            {/* Stepper Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {filteredSteps.map((step, index) => {
                const getActorColor = (actor) => {
                  if (actor === 'USER') return 'var(--color-accent)';
                  if (actor === 'STAFF') return '#059669';
                  if (actor === 'ADMIN') return '#B91C1C';
                  return 'var(--color-primary)';
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    style={{ position: 'relative' }}
                  >
                    {/* Node Dot on Timeline */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2.5rem',
                        top: '1.25rem',
                        transform: 'translateX(-50%)',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: `3px solid ${getActorColor(step.actor)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)',
                        zIndex: 2
                      }}
                    >
                      {step.icon}
                    </div>

                    {/* Step Card Content */}
                    <div
                      className="card"
                      style={{
                        padding: '1.75rem',
                        backgroundColor: '#FFFFFF',
                        borderLeft: `4px solid ${getActorColor(step.actor)}`
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              backgroundColor: `${getActorColor(step.actor)}15`,
                              color: getActorColor(step.actor),
                              textTransform: 'uppercase'
                            }}
                          >
                            {step.actor}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                            {step.stage}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.6rem',
                            borderRadius: '9999px',
                            backgroundColor: '#F1F5F9',
                            color: 'var(--color-primary)',
                            border: '1px solid var(--color-border)'
                          }}
                        >
                          {step.badge}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        {step.title}
                      </h3>

                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {step.description}
                      </p>

                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.75rem 1rem',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        <ul
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            fontSize: '0.825rem',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {step.subSteps.map((sub, sIdx) => (
                            <li key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <CheckCircle2 size={13} color={getActorColor(step.actor)} />
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Card */}
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
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Experience the live workflow yourself
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Register as a service requester to test ticket creation with AI classification, or login using staff demo credentials.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary">
                Register as Requester <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-outline">
                Login with Demo Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
