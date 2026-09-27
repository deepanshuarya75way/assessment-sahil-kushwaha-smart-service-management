import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navigation from '../components/Navigation';
import { CheckSquare, UserCheck, AlertCircle, ChevronRight, Clock, CheckCircle2, UserPlus, FileText, Check, X, Building, MapPin } from 'lucide-react';

export default function StaffWorkspace() {
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Resolution Notes Modal State
  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  // Ticket Rejection Modal State
  const [rejectingTicket, setRejectingTicket] = useState(null);
  const [rejectionCategory, setRejectionCategory] = useState('Not my department');
  const [customRejectionDetails, setCustomRejectionDetails] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  useEffect(() => {
    fetchStaffWorkqueue();
  }, []);

  const fetchStaffWorkqueue = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch assigned tickets for logged in staff
      const assignedRes = await api.get('/staff/tickets');
      if (assignedRes.data.success) {
        setAssignedTickets(assignedRes.data.data);
      }

      // 2. Fetch unassigned tickets queue (PENDING or OPEN)
      const pendingRes = await api.get('/tickets?status=PENDING');
      const openRes = await api.get('/tickets?status=OPEN');
      
      let combined = [];
      if (pendingRes.data.success) combined = [...combined, ...pendingRes.data.data];
      if (openRes.data.success) combined = [...combined, ...openRes.data.data];

      // Remove duplicates and filter unassigned
      const uniqueUnassigned = Array.from(
        new Map(combined.filter((t) => !t.assignedTo).map((item) => [item._id, item])).values()
      );

      setUnassignedTickets(uniqueUnassigned);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff workqueue');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTicket = async (ticketId) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/assign`, {});
      if (response.data.success) {
        fetchStaffWorkqueue();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim ticket');
    }
  };

  // Status Change Handler with Resolution Notes Requirement
  const handleInitiateStatusChange = (ticket, targetStatus) => {
    if (targetStatus === 'RESOLVED') {
      setResolvingTicket(ticket);
      setResolutionNotes('');
      return;
    }

    executeStatusUpdate(ticket._id, targetStatus);
  };

  const executeStatusUpdate = async (ticketId, targetStatus, notes = '') => {
    try {
      const payload = { status: targetStatus };
      if (notes) payload.resolutionNotes = notes;

      const response = await api.put(`/tickets/${ticketId}/status`, payload);
      if (response.data.success) {
        setResolvingTicket(null);
        setResolutionNotes('');
        fetchStaffWorkqueue();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      alert('Please provide resolution notes explaining how the issue was resolved.');
      return;
    }

    setIsSubmittingResolution(true);
    await executeStatusUpdate(resolvingTicket._id, 'RESOLVED', resolutionNotes);
    setIsSubmittingResolution(false);
  };

  // Staff Accept Workflow: ASSIGNED -> IN_PROGRESS
  const handleAcceptTicket = async (ticket) => {
    await executeStatusUpdate(ticket._id, 'IN_PROGRESS');
  };

  // Staff Reject Workflow: Open Rejection Modal
  const handleInitiateRejection = (ticket) => {
    setRejectingTicket(ticket);
    setRejectionCategory('Not my department');
    setCustomRejectionDetails('');
  };

  // Submit Rejection: ASSIGNED -> PENDING (Unassigned with Reason)
  const handleSubmitRejection = async (e) => {
    e.preventDefault();
    if (!rejectingTicket) return;

    let fullReason = rejectionCategory;
    if (customRejectionDetails.trim()) {
      fullReason = `${rejectionCategory}: ${customRejectionDetails.trim()}`;
    }

    setIsSubmittingRejection(true);
    try {
      const response = await api.put(`/tickets/${rejectingTicket._id}/reject`, { reason: fullReason });
      if (response.data.success) {
        setRejectingTicket(null);
        setCustomRejectionDetails('');
        fetchStaffWorkqueue();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject ticket');
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  // Metrics
  const totalAssigned = assignedTickets.length;
  const inProgressCount = assignedTickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = assignedTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '3rem' }}>
      <Navigation />

      <main style={{ maxWidth: '1150px', margin: '2rem auto 0 auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={24} color="var(--color-accent)" /> Dedicated Support Staff Workspace
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Claim incoming customer requests, investigate issues, and provide resolution details.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Staff Workload KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Unassigned Queue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#D97706', marginTop: '0.2rem' }}>{unassignedTickets.length}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3B82F6' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>My Total Workload</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1D4ED8', marginTop: '0.2rem' }}>{totalAssigned}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>In Progress</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-warning-text)', marginTop: '0.2rem' }}>{inProgressCount}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Resolved / Closed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success-text)', marginTop: '0.2rem' }}>{resolvedCount}</div>
          </div>
        </div>

        {/* Unassigned Tickets Queue */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} color="var(--color-warning)" /> Unassigned Ticket Queue
            </span>
            <span className="badge badge-warning">{unassignedTickets.length} Pending</span>
          </h2>

          {unassignedTickets.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              No unassigned tickets in queue. All incoming requests are claimed!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {unassignedTickets.map((ticket) => (
                <div key={ticket._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--color-primary)' }}>{ticket.ticketNumber}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.15rem 0.4rem', backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        {ticket.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'var(--color-danger-text)' : 'var(--color-text-secondary)' }}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{ticket.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>Client: <strong>{ticket.createdBy?.name}</strong></span>
                      {ticket.department && <span>Dept: <strong>{ticket.department}</strong></span>}
                      {ticket.location && <span>Loc: <strong>{ticket.location}</strong></span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimTicket(ticket._id)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    Claim Ticket
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Assigned Tickets */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} color="var(--color-accent)" /> My Assigned Workspace Queue
            </span>
            <span className="badge badge-open">{assignedTickets.length} Assigned</span>
          </h2>

          {assignedTickets.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              You currently have no tickets assigned to you. Claim an item from the unassigned queue above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {assignedTickets.map((ticket) => (
                <div key={ticket._id} style={{ padding: '1.25rem', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{ticket.ticketNumber}</span>
                      <span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/tickets/${ticket._id}`)}
                      style={{ padding: '0.35rem 0.75rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-primary)' }}
                    >
                      View Thread <ChevronRight size={14} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    {ticket.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                    {ticket.description}
                  </p>

                  {ticket.resolutionNotes && (
                    <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#065F46', marginBottom: '0.75rem' }}>
                      <strong>Resolution Notes:</strong> {ticket.resolutionNotes}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Client: <strong>{ticket.createdBy?.name}</strong> ({ticket.createdBy?.email})
                    </div>

                    {/* Sequential Status Progression Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {ticket.status === 'ASSIGNED' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAcceptTicket(ticket)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.4rem 0.85rem',
                              backgroundColor: '#059669',
                              color: '#fff',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Check size={14} /> ACCEPT
                          </button>
                          <button
                            onClick={() => handleInitiateRejection(ticket)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.4rem 0.85rem',
                              backgroundColor: '#fff',
                              color: '#DC2626',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid #DC2626',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={14} /> REJECT
                          </button>
                        </div>
                      )}

                      {ticket.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleInitiateStatusChange(ticket, 'RESOLVED')}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#10B981', color: '#fff', fontSize: '0.8rem', fontWeight: 600, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <CheckCircle2 size={15} /> Resolve Ticket with Notes
                        </button>
                      )}

                      {ticket.status === 'RESOLVED' && (
                        <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Check size={16} /> Resolved (Awaiting User Confirmation)
                        </span>
                      )}

                      {ticket.status === 'CLOSED' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                          Ticket Closed & Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Resolution Notes Modal */}
      {resolvingTicket && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', backgroundColor: '#fff', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} color="#10B981" /> Provide Resolution Notes
              </h2>
              <button onClick={() => setResolvingTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Document the resolution steps, repairs, or outcome for ticket <strong>{resolvingTicket.ticketNumber}</strong> before marking it as RESOLVED.
            </p>

            <form onSubmit={handleSubmitResolution}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                  Resolution Notes *
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe the fix, replacement parts, or investigative findings..."
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResolution || !resolutionNotes.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#10B981', color: '#fff', fontWeight: 600, opacity: isSubmittingResolution ? 0.7 : 1 }}
                >
                  <Check size={16} /> {isSubmittingResolution ? 'Saving...' : 'Mark as RESOLVED'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Rejection Modal */}
      {rejectingTicket && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', backgroundColor: '#fff', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} color="#DC2626" /> Reject Ticket Assignment
              </h2>
              <button onClick={() => setRejectingTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Rejecting ticket <strong>{rejectingTicket.ticketNumber}</strong> will return it to the unassigned queue for administrator reassignment. Please provide a reason:
            </p>

            <form onSubmit={handleSubmitRejection}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                  Rejection Reason *
                </label>
                <select
                  value={rejectionCategory}
                  onChange={(e) => setRejectionCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', backgroundColor: '#fff' }}
                >
                  <option value="Not my department">Not my department</option>
                  <option value="Not my skill area">Not my skill area</option>
                  <option value="Currently unavailable">Currently unavailable</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                  Additional Explanation / Notes
                </label>
                <textarea
                  value={customRejectionDetails}
                  onChange={(e) => setCustomRejectionDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide context for the administrator (e.g. requires specialized certification)..."
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectingTicket(null)}
                  style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', borderRadius: 'var(--radius-md)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRejection}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#DC2626', color: '#fff', fontWeight: 600, borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', opacity: isSubmittingRejection ? 0.7 : 1 }}
                >
                  <X size={16} /> {isSubmittingRejection ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

