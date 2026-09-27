import React, { useState } from 'react';
import api from '../services/api';
import { X, Plus, AlertCircle, Sparkles, Check, RefreshCw } from 'lucide-react';

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [priority, setPriority] = useState('MEDIUM');
  const [department, setDepartment] = useState('General Support');
  const [location, setLocation] = useState('');

  // AI Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiError, setAiError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Trigger AI Classification Request
  const handleFetchAiSuggestion = async () => {
    setAiError('');
    if (!title.trim() && !description.trim()) {
      setAiError('Please enter a title or description first to run AI classification.');
      return;
    }

    setIsClassifying(true);
    try {
      const response = await api.post('/ai/classify-ticket', { title, description });
      if (response.data.success) {
        setAiSuggestion(response.data.data);
      }
    } catch (err) {
      setAiError(err.response?.data?.message || 'AI service unavailable. You can continue manually.');
    } finally {
      setIsClassifying(false);
    }
  };

  // Apply AI Suggestion to Form Fields upon explicit User action
  const handleApplyAiSuggestion = () => {
    if (aiSuggestion) {
      if (aiSuggestion.category) setCategory(aiSuggestion.category);
      if (aiSuggestion.priority) setPriority(aiSuggestion.priority);
      if (aiSuggestion.department) setDepartment(aiSuggestion.department);
      setAiSuggestion(null); // Clear suggestion banner after applying
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/tickets', {
        title,
        description,
        category,
        priority,
        department,
        location
      });

      if (response.data.success) {
        setTitle('');
        setDescription('');
        setCategory('Technical');
        setPriority('MEDIUM');
        setDepartment('General Support');
        setLocation('');
        setAiSuggestion(null);
        onTicketCreated(response.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '1rem', overflowY: 'auto' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', color: 'var(--color-text-secondary)', padding: '0.25rem' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.25rem', fontWeight: 700 }}>
          Create Service Request
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Submit a new service ticket to report an issue or request assistance.
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Ticket Title *
              </label>
              <button
                type="button"
                onClick={handleFetchAiSuggestion}
                disabled={isClassifying}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.6rem', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--color-accent)' }}
              >
                <Sparkles size={13} /> {isClassifying ? 'Analyzing with AI...' : 'Auto-Suggest with AI'}
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Power outage in main conference room"
              required
              style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide relevant details, meter readings, or error messages..."
              required
              style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* AI Pre-Submission Review Banner */}
          {aiError && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-danger-text)', marginBottom: '1rem' }}>
              {aiError}
            </div>
          )}

          {aiSuggestion && (
            <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                  <Sparkles size={16} color="var(--color-accent)" /> AI Ticket Assistant Recommendations
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                  Confidence: {Math.round((aiSuggestion.confidence || 0.85) * 100)}%
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.7rem' }}>Category</span>
                  <strong>{aiSuggestion.category}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.7rem' }}>Priority</span>
                  <strong>{aiSuggestion.priority}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '0.7rem' }}>Department</span>
                  <strong>{aiSuggestion.department}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: '#fff', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--color-accent)', color: '#fff' }}
                >
                  <Check size={14} /> Apply AI Suggestions
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', backgroundColor: '#fff' }}
              >
                <option value="IT Support">IT Support</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="Account">Account</option>
                <option value="General">General</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', backgroundColor: '#fff' }}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                Department / Unit
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Electrical Maintenance"
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                Location / Office
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Building 2, Floor 3"
                style={{ width: '100%', padding: '0.625rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: 'var(--color-primary)', color: '#fff', opacity: isSubmitting ? 0.7 : 1 }}
            >
              <Plus size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
