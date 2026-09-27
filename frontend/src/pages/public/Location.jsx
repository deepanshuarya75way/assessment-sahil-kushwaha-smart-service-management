import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Building, Compass, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Location() {
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
              Operations & Facility
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
              Platform Operational Center & Demo Facility
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}
            >
              Smart Service Management centralizes support dispatching across facilities, branch offices, and remote enterprise operations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Location Content */}
      <section className="section-padding">
        <div className="public-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start'
            }}
          >
            {/* Facility Details Card */}
            <div>
              <div
                className="card"
                style={{
                  padding: '2.5rem',
                  backgroundColor: '#FFFFFF',
                  borderLeft: '5px solid var(--color-accent)',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-accent-light)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Building size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                      Central Support Headquarters
                    </h2>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                      Project Demo Facility
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Physical Address:</div>
                      <div>Smart Service Management Hub, Tech Park Corridor</div>
                      <div>Building C, Operations Suite 400</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                        (Configured project demonstration facility location)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Compass size={20} color="#059669" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Dispatch Zones:</div>
                      <div>Zone A (Engineering), Zone B (Data Center), Zone C (Corporate Admin)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <Clock size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Operating Hours:</div>
                      <div>Monday – Friday: 08:00 AM – 06:00 PM Local Time</div>
                      <div>Critical P1 Infrastructure: 24/7 Monitored Dispatch</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                  >
                    <Navigation size={15} /> Open Navigation Guidance <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              {/* Multi-Location Support Information */}
              <div
                className="card"
                style={{
                  padding: '1.75rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--color-border)'
                }}
              >
                <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Multi-Location Service Tagging
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Requesters can tag any physical room, floor, or building campus during ticket creation. Staff resolvers filter queues by assigned zone or department to expedite on-site troubleshooting.
                </p>
              </div>
            </div>

            {/* Interactive Clean Map UI Area */}
            <div>
              <div
                className="card"
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <MapPin size={18} color="var(--color-accent)" /> Operational Campus Map Preview
                  </div>
                  <span className="badge badge-open">HQ Node Online</span>
                </div>

                {/* Stylized Clean SVG / Canvas Map Visualization */}
                <div
                  style={{
                    width: '100%',
                    height: '360px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#0F172A',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #334155'
                  }}
                >
                  {/* Grid Lines Pattern */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.25) 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Concentric Signal Rings */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      border: '1px dashed rgba(59, 130, 246, 0.4)',
                      animation: 'spin 20s linear infinite'
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.5)'
                    }}
                  />

                  {/* Central Node Pin */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)'
                      }}
                    >
                      <MapPin size={22} />
                    </div>
                    <div
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid #475569',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      Tech Center Operations Center
                    </div>
                  </div>

                  {/* Peripheral Facility Dots */}
                  <div style={{ position: 'absolute', top: '35px', left: '45px', color: '#94A3B8', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span>Zone A (Eng)</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '40px', right: '45px', color: '#94A3B8', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                    <span>Zone B (DC)</span>
                  </div>
                  <div style={{ position: 'absolute', top: '50px', right: '60px', color: '#94A3B8', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <span>Zone C (HQ)</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  <span>Lat: 37.7749° N, Lon: -122.4194° W</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>• All Service Nodes Responsive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
