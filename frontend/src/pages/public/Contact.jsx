import React, { useState } from 'react';
import api from '../../services/api';
import { Mail, Send, CheckCircle2, AlertCircle, Clock, MapPin, MessageSquare, Phone } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(response.data.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please verify network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get In Touch
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
              Contact Support & Platform Inquiries
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}
            >
              Have questions regarding system deployment, role configuration, or incident escalation? Submit a message directly to our operations team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Demo Contact Details */}
      <section className="section-padding">
        <div className="public-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start'
            }}
          >
            {/* Contact Form */}
            <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Send Us a Message
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Fill out the form below and an operations team member will review your inquiry.
              </p>

              {submitSuccess ? (
                <div
                  style={{
                    padding: '2rem',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.25rem', color: '#065F46', marginBottom: '0.5rem' }}>
                    Message Received Successfully!
                  </h3>
                  <p style={{ color: '#047857', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Thank you for reaching out. Your message has been logged in the system contact queue.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="btn-outline"
                    style={{ borderColor: '#059669', color: '#065F46' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-danger-light)',
                        border: '1px solid var(--color-danger)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-danger-text)',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="E.g., Inquiring about department onboarding"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Provide details about your inquiry..."
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.8rem', justifyContent: 'center', fontSize: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Sending Message...' : (
                      <>
                        <Send size={16} /> Send Inquiry Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Configured Contact Info / Placeholders */}
            <div>
              <div
                className="card"
                style={{
                  padding: '2rem',
                  backgroundColor: '#FFFFFF',
                  marginBottom: '1.5rem',
                  borderLeft: '4px solid var(--color-primary)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                  Project Support Desk Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                        Platform Inquiries Email
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.15rem' }}>
                        support@smartservice.demo
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        Project demo email placeholder (configured via backend env)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                        Standard Support Hours
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.15rem' }}>
                        Monday – Friday: 08:00 – 18:00 Local Time
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        Emergency P1 infrastructure requests monitored 24/7
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                        Operational Facility
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.15rem' }}>
                        Enterprise Tech Center, Building C
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        Demo campus headquarters placeholder
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security notice */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6
                }}
              >
                <strong>Privacy & Security Notice:</strong> Messages submitted via this public contact portal are stored securely in the database for operational auditing. Please do not submit confidential passwords or payment credentials through this form.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
