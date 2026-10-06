import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, Send, User, Clock, CheckCircle2, AlertCircle, Shield, Sparkles, MapPin, Building, History, Check, UserPlus, Tag, AlertTriangle } from 'lucide-react';
import { useSocket } from '../context/SocketContext'; 

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticketData, setTicketData] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const {
    subscribeToTIcket,
    onTicketEvent } = useSocket();
  }

  useEffect(() => {
    if(!ticketId) return ;
      subscribeToTIcket(TicketId);

      const cleanup = onTicketEvent((Event) => {
        if(event.TicketId === ticketId){
          fetchTicket();
        }

    });
    return cleanup;
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tickets/${id}`);
      if (response.data.success) {
        setTicketData(response.data.data.ticket);
        setComments(response.data.data.comments || []);
        setHistory(response.data.data.history || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const response = await api.post(`/tickets/${id}/comments`, { message: newComment });
      if (response.data.success) {
        setComments((prev) => [...prev, response.data.data]);
        setNewComment('');
        // Refresh full timeline
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // User Resolution Acceptance Action (RESOLVED -> CLOSED)
  const handleConfirmResolution = async () => {
    if (!window.confirm('Are you sure you want to confirm resolution and close this ticket?')) return;

    setIsUpdatingStatus(true);
    try {
      const response = await api.put(`/tickets/${id}/status`, { status: 'CLOSED' });
      if (response.data.success) {
        setTicketData(response.data.data);
        fetchTicketDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close ticket');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          Loading ticket timeline...
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <AlertCircle size={40} color="var(--color-danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Unable to load ticket</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Combine Comments and History into a Unified Chronological Activity Timeline
  const formattedComments = comments.map((c) => ({
    id: c._id,
    type: 'COMMENT',
    timestamp: new Date(c.createdAt),
    author: c.userId?.name || 'User',
    role: c.userId?.role || 'USER',
    isCurrentUser: c.userId?._id === user?.id,
    message: c.message
  }));

  const formattedHistory = history.map((h) => ({
    id: h._id,
    type: 'AUDIT_LOG',
    action: h.action,
    timestamp: new Date(h.createdAt),
    author: h.changedBy?.name || h.changedBy?.email || 'System',
    role: h.changedBy?.role || 'SYSTEM',
    previousValue: h.previousValue,
    newValue: h.newValue
  }));

  const unifiedTimeline = [...formattedComments, ...formattedHistory].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <header style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#93C5FD' }}>{ticketData.ticketNumber}</span>
            <span className={`badge badge-${ticketData.status.toLowerCase()}`}>{ticketData.status}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '2rem auto 0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '1.5rem' }}>
          
          {/* Left Column: Ticket Details & Unified Activity Timeline */}
          <div>
            {/* Resolution Confirmation Banner */}
            {ticketData.status === 'RESOLVED' && (
              <div style={{ padding: '1.25rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065F46', fontWeight: 700, fontSize: '1rem' }}>
                    <CheckCircle2 size={20} color="#059669" /> Issue Resolved by Support Staff
                  </div>
                  <p style={{ color: '#047857', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Please review the resolution notes below. If your issue is resolved, click to confirm resolution and close this request.
                  </p>
                </div>
                <button
                  onClick={handleConfirmResolution}
                  disabled={isUpdatingStatus}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#059669', color: '#fff', fontWeight: 600, fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}
                >
                  <Check size={18} /> {isUpdatingStatus ? 'Closing Ticket...' : 'Confirm & Close Ticket'}
                </button>
              </div>
            )}

            {/* Resolution Notes Card */}
            {ticketData.resolutionNotes && (
              <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #10B981', backgroundColor: '#F0FDF4' }}>
                <h3 style={{ fontSize: '0.95rem', color: '#065F46', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Support Staff Resolution Notes
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {ticketData.resolutionNotes}
                </p>
              </div>
            )}

            {/* Ticket Header & Description Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                  {ticketData.category}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ticketData.priority === 'URGENT' || ticketData.priority === 'HIGH' ? 'var(--color-danger-text)' : 'var(--color-text-secondary)' }}>
                  {ticketData.priority} PRIORITY
                </span>
              </div>

              <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 700 }}>
                {ticketData.title}
              </h1>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--color-text-primary)' }}>
                {ticketData.description}
              </div>
            </div>

            {/* Unified Activity & Comment Timeline Card */}
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                <History size={20} color="var(--color-accent)" /> Unified Activity & Comment Audit Timeline ({unifiedTimeline.length})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
                {unifiedTimeline.length === 0 ? (
                  <div style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    No activity or comments recorded yet on this ticket.
                  </div>
                ) : (
                  unifiedTimeline.map((item) => {
                    if (item.type === 'COMMENT') {
                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: '1rem',
                            backgroundColor: item.isCurrentUser ? '#EFF6FF' : 'var(--color-bg)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            marginLeft: '0.5rem',
                            borderLeft: '4px solid var(--color-accent)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <MessageSquare size={16} color="var(--color-accent)" />
                              <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{item.author}</strong>
                              <span className={`badge badge-${item.role === 'ADMIN' ? 'danger' : item.role === 'STAFF' ? 'warning' : 'open'}`} style={{ fontSize: '0.65rem' }}>
                                {item.role}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                              {item.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                        </div>
                      );
                    } else {
                      // AUDIT_LOG item
                      let icon = <Clock size={16} color="var(--color-text-secondary)" />;
                      let badgeColor = '#F3F4F6';
                      let textColor = 'var(--color-text-primary)';

                      if (item.action === 'TICKET_CREATED') {
                        icon = <Sparkles size={16} color="var(--color-accent)" />;
                        badgeColor = '#EFF6FF';
                      } else if (item.action === 'STAFF_ASSIGNED') {
                        icon = <UserPlus size={16} color="#3B82F6" />;
                        badgeColor = '#DBEAFE';
                      } else if (item.action === 'STATUS_CHANGED') {
                        icon = <CheckCircle2 size={16} color="#10B981" />;
                        badgeColor = '#D1FAE5';
                      } else if (item.action === 'PRIORITY_CHANGED') {
                        icon = <AlertTriangle size={16} color="#F59E0B" />;
                        badgeColor = '#FEF3C7';
                      }

                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: badgeColor,
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.825rem',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            {icon}
                            <div>
                              <span style={{ fontWeight: 700, color: 'var(--color-primary)', marginRight: '0.35rem' }}>
                                {item.action.replace('_', ' ')}:
                              </span>
                              {item.previousValue ? (
                                <span>Changed from <strong style={{ color: 'var(--color-text-secondary)' }}>{item.previousValue}</strong> to <strong>{item.newValue}</strong></span>
                              ) : (
                                <span>Set to <strong>{item.newValue}</strong></span>
                              )}
                              <span style={{ color: 'var(--color-text-secondary)', marginLeft: '0.35rem', fontSize: '0.75rem' }}>
                                by {item.author} ({item.role})
                              </span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.725rem', color: 'var(--color-text-secondary)' }}>
                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    }
                  })
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Post an update or reply to this ticket thread..."
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '0.85rem', opacity: isSubmittingComment ? 0.7 : 1 }}
                  >
                    <Send size={15} /> {isSubmittingComment ? 'Posting...' : 'Post Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar Column: Metadata Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>
                Ticket Overview
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Submitted By</span>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.2rem' }}>
                    {ticketData.createdBy?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {ticketData.createdBy?.email}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Department & Location</span>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building size={14} color="var(--color-accent)" /> {ticketData.department || 'General Support'}
                  </div>
                  {ticketData.location && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="var(--color-text-secondary)" /> {ticketData.location}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Assigned Support Staff</span>
                  <div style={{ fontWeight: 600, color: ticketData.assignedTo ? 'var(--color-text-primary)' : 'var(--color-warning-text)', marginTop: '0.2rem' }}>
                    {ticketData.assignedTo ? ticketData.assignedTo.name : 'Unassigned (Queue)'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>AI Intelligent Tagging</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                    <Sparkles size={16} color="var(--color-accent)" /> 
                    <span>{ticketData.aiCategory || ticketData.category}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--color-accent-light)', border: '1px solid var(--color-accent)', borderRadius: '4px' }}>
                      {ticketData.aiPriority || ticketData.priority}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.75rem' }}>Created Timestamp</span>
                  <div style={{ color: 'var(--color-text-primary)', marginTop: '0.2rem' }}>
                    {new Date(ticketData.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );

