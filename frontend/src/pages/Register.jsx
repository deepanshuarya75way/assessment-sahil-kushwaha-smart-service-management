import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Briefcase,
  IdCard,
  Upload,
  AlertCircle,
  CheckCircle2,
  Server,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Register() {
  const [activeTab, setActiveTab] = useState('USER'); // ONLY 'USER' or 'STAFF'

  // User Registration State
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  // Staff Registration State
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    jobRole: '',
    password: '',
    confirmPassword: ''
  });
  const [idCardFile, setIdCardFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [staffSuccessData, setStaffSuccessData] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle User Registration
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (userForm.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setFormError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);
    // User role is strictly enforced as USER
    const result = await register(userForm.name.trim(), userForm.email.trim(), userForm.password, 'USER');
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.error);
    }
  };

  // Handle Staff Verification Registration
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (
      !staffForm.name.trim() ||
      !staffForm.email.trim() ||
      !staffForm.phone.trim() ||
      !staffForm.employeeId.trim() ||
      !staffForm.department.trim() ||
      !staffForm.jobRole.trim() ||
      !staffForm.password
    ) {
      setFormError('Please fill in all required staff verification fields.');
      return;
    }

    if (staffForm.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (staffForm.password !== staffForm.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (!idCardFile) {
      setFormError('Please upload a copy of your Staff ID Card or Employee Credential document.');
      return;
    }

    // Validate file size (5MB max)
    if (idCardFile.size > 5 * 1024 * 1024) {
      setFormError('Staff ID document size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', staffForm.name.trim());
    formData.append('email', staffForm.email.trim());
    formData.append('phone', staffForm.phone.trim());
    formData.append('employeeId', staffForm.employeeId.trim());
    formData.append('department', staffForm.department.trim());
    formData.append('jobRole', staffForm.jobRole.trim());
    formData.append('password', staffForm.password);
    formData.append('idCard', idCardFile);

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/register-staff', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setStaffSuccessData(response.data.data);
      } else {
        setFormError(response.data.message || 'Staff verification request submission failed.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit staff verification. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #F0F6FF 0%, #F8FAFC 50%, #EEF4FF 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Ambient Background Decorative Accents */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(240, 246, 255, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          right: '12%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 47, 107, 0.06) 0%, rgba(240, 246, 255, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Brand Bar */}
      <header
        style={{
          padding: '1.15rem 2rem',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Server size={18} color="var(--color-accent)" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>
            Smart Service Management
          </span>
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '540px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Select your role category to begin registration
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '2.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px -5px rgba(15, 47, 107, 0.08), 0 8px 10px -6px rgba(15, 47, 107, 0.03)'
            }}
          >
            {/* Registration Role Tabs: Strictly USER or STAFF */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                backgroundColor: '#F1F5F9',
                padding: '0.35rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem'
              }}
            >
              <button
                type="button"
                onClick={() => { setActiveTab('USER'); setFormError(''); }}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === 'USER' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'USER' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'USER' ? 'var(--shadow-sm)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <User size={16} /> Service Requester
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('STAFF'); setFormError(''); }}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === 'STAFF' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'STAFF' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'STAFF' ? 'var(--shadow-sm)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShieldCheck size={16} /> Staff Verification
              </button>
            </div>

            {formError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-danger-light)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-danger-text)',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  lineHeight: 1.5
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span>{formError}</span>
              </div>
            )}

            {/* TAB 1: USER REGISTRATION */}
            {activeTab === 'USER' && (
              <form onSubmit={handleUserSubmit}>
                <div style={{ marginBottom: '1.15rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      required
                      style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.15rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="jane@company.com"
                      required
                      style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                      Department
                    </label>
                    <input
                      type="text"
                      value={userForm.department}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                      placeholder="E.g., Finance, HR"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.15rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                    Password * (Min. 6 characters)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', padding: '0.65rem 2.4rem 0.65rem 2.4rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-secondary)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={17} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Creating Requester Account...' : 'Register as Service Requester'}
                </button>
              </form>
            )}

            {/* TAB 2: STAFF REGISTRATION / VERIFICATION */}
            {activeTab === 'STAFF' && (
              <>
                {staffSuccessData ? (
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
                      Verification Application Submitted!
                    </h3>
                    <div style={{ display: 'inline-block', backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', marginBottom: '1rem' }}>
                      STATUS: PENDING VERIFICATION
                    </div>
                    <p style={{ color: '#047857', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Your staff verification request (Employee ID: <strong>{staffSuccessData.employeeId}</strong>) has been queued for administrative credential review. You will receive authorization to log in once an administrator approves your identity.
                    </p>
                    <Link to="/login" className="btn-primary" style={{ backgroundColor: '#059669' }}>
                      Return to Sign In
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: '#1E40AF',
                        lineHeight: 1.5,
                        marginBottom: '1.5rem'
                      }}
                    >
                      <strong>Staff Credential Verification Required:</strong> Staff accounts resolve active tickets and cannot be created automatically. All applicants must submit verification credentials and an ID document for administrator approval before activation.
                    </div>

                    <form onSubmit={handleStaffSubmit}>
                      <div style={{ marginBottom: '1.15rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          placeholder="Alex Rivera"
                          required
                          style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.15rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                            Organization Email *
                          </label>
                          <input
                            type="email"
                            value={staffForm.email}
                            onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                            placeholder="alex@company.com"
                            required
                            style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                            Phone Number *
                          </label>
                          <input
                            type="text"
                            value={staffForm.phone}
                            onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                            required
                            style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.15rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                            Employee ID *
                          </label>
                          <input
                            type="text"
                            value={staffForm.employeeId}
                            onChange={(e) => setStaffForm({ ...staffForm, employeeId: e.target.value })}
                            placeholder="EMP-8942"
                            required
                            style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                            Department *
                          </label>
                          <input
                            type="text"
                            value={staffForm.department}
                            onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                            placeholder="Technical Support"
                            required
                            style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '1.15rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                          Job Title / Technical Role *
                        </label>
                        <input
                          type="text"
                          value={staffForm.jobRole}
                          onChange={(e) => setStaffForm({ ...staffForm, jobRole: e.target.value })}
                          placeholder="Senior Network Engineer"
                          required
                          style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                        />
                      </div>

                      {/* Staff ID Card Document Upload */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                          Company/Staff ID Card Upload * (JPG, PNG, PDF max 5MB)
                        </label>
                        <div
                          style={{
                            border: '2px dashed var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '1.25rem',
                            textAlign: 'center',
                            backgroundColor: '#F8FAFC',
                            position: 'relative'
                          }}
                        >
                          <Upload size={24} color="var(--color-accent)" style={{ margin: '0 auto 0.5rem auto' }} />
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                            {idCardFile ? idCardFile.name : 'Select or drop employee ID card / badge'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                            {idCardFile ? `${(idCardFile.size / 1024).toFixed(1)} KB` : 'Private & encrypted document storage'}
                          </div>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(e) => setIdCardFile(e.target.files[0] || null)}
                            required
                            style={{
                              position: 'absolute',
                              inset: 0,
                              opacity: 0,
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                            Password *
                          </label>
                          <input
                            type="password"
                            value={staffForm.password}
                            onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                            placeholder="Min. 6 chars"
                            required
                            style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                            Confirm Password *
                          </label>
                          <input
                            type="password"
                            value={staffForm.confirmPassword}
                            onChange={(e) => setStaffForm({ ...staffForm, confirmPassword: e.target.value })}
                            placeholder="Confirm"
                            required
                            style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
                      >
                        {isSubmitting ? 'Uploading & Submitting Application...' : 'Submit Staff Verification Request'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}

            <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                Sign In to Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
