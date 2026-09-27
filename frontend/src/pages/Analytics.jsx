import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navigation from '../components/Navigation';
import { BarChart3, Clock, AlertCircle, PieChart, Layers, UserCheck, Calendar } from 'lucide-react';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/analytics?range=${dateRange}`);
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics metrics');
    } finally {
      setLoading(false);
    }
  };

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

  const totalTicketsCount = analytics?.byCategory?.reduce((acc, c) => acc + c.count, 0) || 1;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '3rem' }}>
      <Navigation />

      <main style={{ maxWidth: '1150px', margin: '2rem auto 0 auto', padding: '0 1rem' }}>
        {/* Header Action Bar with Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={24} color="var(--color-accent)" /> Service Operational Analytics
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Comprehensive performance insights, category volume metrics, and resolution velocity.
            </p>
          </div>

          {/* Date Range Filter Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.5rem 0.85rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={16} color="var(--color-accent)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Timeframe:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ border: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', backgroundColor: 'transparent', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">All Time</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Resolution Time KPI Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Average Resolution Time</span>
              <Clock size={20} color="var(--color-accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {analytics?.resolutionMetrics?.averageResolutionHours || 0} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Hours</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Calculated across {analytics?.resolutionMetrics?.resolvedCount || 0} resolved ticket lifecycle(s).
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Resolution Rate</span>
              <PieChart size={20} color="var(--color-success)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success-text)' }}>
              {Math.round(((analytics?.resolutionMetrics?.resolvedCount || 0) / totalTicketsCount) * 100)}%
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Percentage of tickets successfully resolved or closed.
            </p>
          </div>
        </div>

        {/* Category & Priority Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Category Distribution Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--color-accent)" /> Volume by Category ({dateRange.toUpperCase()})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analytics?.byCategory?.map((cat) => {
                const percentage = Math.round((cat.count / totalTicketsCount) * 100);
                return (
                  <div key={cat.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>
                      <span>{cat.category}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{cat.count} ticket(s) ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Breakdown Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} color="var(--color-warning)" /> Priority Distribution ({dateRange.toUpperCase()})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((prio) => {
                const found = analytics?.byPriority?.find((p) => p.priority === prio);
                const count = found ? found.count : 0;
                const percentage = Math.round((count / totalTicketsCount) * 100);
                const barColor = prio === 'URGENT' || prio === 'HIGH' ? 'var(--color-danger)' : prio === 'MEDIUM' ? 'var(--color-warning)' : 'var(--color-accent)';

                return (
                  <div key={prio}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 500 }}>
                      <span style={{ fontWeight: 600, color: prio === 'URGENT' ? 'var(--color-danger-text)' : 'inherit' }}>{prio}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{count} ticket(s) ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Staff Workload Analytics Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={20} color="var(--color-primary)" /> Support Staff Workload Distribution
            </h2>
          </div>

          {analytics?.staffWorkload?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              No tickets are currently assigned to support staff members in this timeframe.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.875rem 1.25rem' }}>Staff Agent</th>
                    <th style={{ padding: '0.875rem 1.25rem' }}>Email</th>
                    <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Active Assigned Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.staffWorkload?.map((s) => (
                    <tr key={s._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-secondary)' }}>{s.email}</td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-accent)' }}>
                        {s.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
