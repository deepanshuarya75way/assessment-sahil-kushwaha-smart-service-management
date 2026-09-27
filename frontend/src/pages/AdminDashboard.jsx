import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navigation from '../components/Navigation';
import {
  Shield,
  Users,
  Ticket,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  UserCog,
  Search,
  FileCheck,
  ExternalLink,
  XCircle,
  Building,
  Briefcase,
  IdCard
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationStatusFilter, setVerificationStatusFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch dashboard metrics
      const statsRes = await api.get('/admin/dashboard');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch all users
      const usersRes = await api.get('/admin/users');
      if (usersRes.data.success) {
        const uList = usersRes.data.data;
        setUsersList(uList);
        setStaffMembers(uList.filter((u) => (u.role === 'STAFF' || u.role === 'ADMIN') && (u.status === 'ACTIVE' || !u.status)));
      }

      // 3. Fetch global tickets
      const ticketsRes = await api.get('/tickets');
      if (ticketsRes.data.success) {
        setAllTickets(ticketsRes.data.data);
      }

      // 4. Fetch staff verification requests
      const verifRes = await api.get('/admin/staff-verifications');
      if (verifRes.data.success) {
        setVerifications(verifRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin controls');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleStatusToggle = async (userObj) => {
    const nextStatus = userObj.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    const confirmMsg = nextStatus === 'INACTIVE'
      ? `Are you sure you want to deactivate ${userObj.name}? They will be blocked from logging into the platform.`
      : `Reactivate user account for ${userObj.name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await api.put(`/admin/users/${userObj._id}/status`, { status: nextStatus });
      if (response.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user account status');
    }
  };

  const handleReassignTicket = async (ticketId, staffId) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/assign`, { staffId });
      if (response.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reassign ticket');
    }
  };

  // Staff Verification Handlers
  const handleApproveVerification = async (verifId, applicantName) => {
    if (!window.confirm(`Approve credentials for ${applicantName}? This will elevate the user to STAFF and activate their account.`)) return;

    try {
      const response = await api.put(`/admin/staff-verifications/${verifId}/review`, { status: 'APPROVED' });
      if (response.data.success) {
        alert(`Staff verification approved for ${applicantName}. Account is now ACTIVE as STAFF.`);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve staff verification');
    }
  };

  const handleRejectVerification = async (verifId, applicantName) => {
    const reason = window.prompt(`Enter reason for rejecting verification application for ${applicantName}:`, 'Unverified employee credentials or invalid ID card documentation');
    if (reason === null) return;

    try {
      const response = await api.put(`/admin/staff-verifications/${verifId}/review`, {
        status: 'REJECTED',
        rejectionReason: reason
      });
      if (response.data.success) {
        alert(`Staff application for ${applicantName} has been rejected.`);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject staff verification');
    }
  };

  const handleViewDocument = async (verifId) => {
    try {
      const response = await api.get(`/admin/staff-verifications/${verifId}/document`, {
        responseType: 'blob'
      });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert('Unable to load verification document file.');
    }
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesStatus = statusFilter ? (u.status || 'ACTIVE') === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filtered Verifications List
  const filteredVerifications = verifications.filter((v) => {
    if (!verificationStatusFilter) return true;
    return v.status === verificationStatusFilter;
  });

  const pendingVerificationsCount = verifications.filter((v) => v.status === 'PENDING').length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <Navigation />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--color-text-secondary)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--color-accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '3rem' }}>
      <Navigation />

      <main style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', padding: '0 1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} color="var(--color-primary)" /> Administrator Management & Dispatch Center
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Review staff credential verifications, manage account roles and statuses, and reassign ticket queues.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* System Summary KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Registered Accounts</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>{stats?.users?.total || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {stats?.users?.clients} Clients • {stats?.users?.staff} Staff • {stats?.users?.admins} Admins
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Staff Verifications</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#D97706', marginTop: '0.25rem' }}>
              {pendingVerificationsCount} Pending
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {verifications.length} total applications submitted
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Unassigned Queue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-warning-text)', marginTop: '0.25rem' }}>{stats?.tickets?.unassigned || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>Awaiting staff assignment</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Resolved / Closed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success-text)', marginTop: '0.25rem' }}>
              {(stats?.tickets?.resolved || 0) + (stats?.tickets?.closed || 0)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>Completed resolutions</div>
          </div>
        </div>

        {/* STAFF VERIFICATION SECTION (Requirement 15) */}
        <div className="card" style={{ marginBottom: '2rem', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={20} color="#D97706" /> Staff Credential Verification Requests
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Inspect uploaded credentials and approve or reject staff resolver applications.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={verificationStatusFilter}
                onChange={(e) => setVerificationStatusFilter(e.target.value)}
                style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: '#fff' }}
              >
                <option value="">All Verification Statuses</option>
                <option value="PENDING">PENDING Review</option>
                <option value="APPROVED">APPROVED (Active Staff)</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Applicant</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Employee ID</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Department & Role</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Credential Doc</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Review Decision</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      No staff verification requests found matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredVerifications.map((v) => {
                    const isPending = v.status === 'PENDING';
                    const isApproved = v.status === 'APPROVED';
                    const isRejected = v.status === 'REJECTED';

                    return (
                      <tr key={v._id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: isPending ? '#FFFBEB' : 'transparent' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{v.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{v.organizationEmail} • {v.phone}</div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                          {v.employeeId}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: 500 }}>{v.department}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{v.jobRole}</div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button
                            type="button"
                            onClick={() => handleViewDocument(v._id)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              color: 'var(--color-accent)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <ExternalLink size={13} /> View ID ({v.idCardOriginalName?.substring(0, 14)}...)
                          </button>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '12px',
                              backgroundColor: isApproved ? '#D1FAE5' : isPending ? '#FEF3C7' : '#FEE2E2',
                              color: isApproved ? '#065F46' : isPending ? '#B45309' : '#991B1B'
                            }}
                          >
                            {v.status}
                          </span>
                          {v.rejectionReason && (
                            <div style={{ fontSize: '0.7rem', color: '#B91C1C', marginTop: '0.25rem' }}>
                              Reason: {v.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          {isPending ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleApproveVerification(v._id, v.fullName)}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: '#059669',
                                  color: '#fff',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <CheckCircle2 size={13} /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectVerification(v._id, v.fullName)}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: '#DC2626',
                                  color: '#fff',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                              Reviewed on {new Date(v.reviewedAt || v.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Role & Soft-Deactivation Management Section */}
        <div className="card" style={{ marginBottom: '2rem', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCog size={20} color="var(--color-accent)" /> User & Staff Account Management
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Soft-deactivate users to revoke access or adjust verified role permissions.
              </p>
            </div>

            {/* User Search & Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user or email..."
                  style={{ padding: '0.35rem 0.5rem 0.35rem 1.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', width: '180px' }}
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: '#fff' }}
              >
                <option value="">All Roles</option>
                <option value="USER">USER</option>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: '#fff' }}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.875rem 1.25rem' }}>User Name</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Email Address</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Current Role</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Joined Date</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Actions & Controls</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      No user accounts match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isInactive = u.status === 'INACTIVE';
                    const isPending = u.status === 'PENDING_VERIFICATION';

                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: isInactive ? '#FEF2F2' : isPending ? '#FFFBEB' : 'transparent' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: isInactive ? 'var(--color-danger-text)' : 'var(--color-text-primary)' }}>
                          {u.name}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '12px',
                              backgroundColor: isInactive ? '#FEE2E2' : isPending ? '#FEF3C7' : '#D1FAE5',
                              color: isInactive ? '#991B1B' : isPending ? '#B45309' : '#065F46'
                            }}
                          >
                            {u.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span className={`badge badge-${u.role === 'ADMIN' ? 'danger' : u.role === 'STAFF' ? 'warning' : 'open'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            {/* Role Select (Only USER <-> STAFF allowed; ADMIN is single fixed account) */}
                            {u.role !== 'ADMIN' && (
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: '#fff' }}
                              >
                                <option value="USER">USER</option>
                                <option value="STAFF">STAFF</option>
                              </select>
                            )}

                            {/* Soft-Deactivation Toggle */}
                            {u.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleStatusToggle(u)}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: isInactive ? '#059669' : '#DC2626',
                                  color: '#fff',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                {isInactive ? 'Reactivate' : 'Deactivate'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Ticket Reassignment Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ticket size={20} color="var(--color-accent)" /> Global Ticket Queue Reassignment
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{allTickets.length} Total System Tickets</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Ticket #</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Title</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.875rem 1.25rem' }}>Assigned Staff</th>
                  <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Reassign Staff</th>
                </tr>
              </thead>
              <tbody>
                {allTickets.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>{t.ticketNumber}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      <div>{t.title}</div>
                      {t.rejectionReason && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: '#B91C1C', backgroundColor: '#FEF2F2', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #FCA5A5', display: 'inline-block' }}>
                          <strong>Staff Rejected:</strong> {t.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-secondary)' }}>
                      {t.assignedTo ? t.assignedTo.name : <span style={{ color: 'var(--color-warning-text)', fontWeight: 600 }}>Unassigned</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <select
                        value={t.assignedTo?._id || ''}
                        onChange={(e) => handleReassignTicket(t._id, e.target.value)}
                        style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: '#fff' }}
                      >
                        <option value="">Select Active Staff...</option>
                        {staffMembers.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} ({s.role})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
