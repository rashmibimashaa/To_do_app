// src/app/register/page.tsx

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      if (response.success) {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 5 ? 'medium' : 'weak';

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        maxWidth: '900px',
        width: '100%',
        display: 'flex',
        minHeight: '600px',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
      }}>
        
        {/* Left Panel */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            marginBottom: '20px',
            fontWeight: 700
          }}>
            Join us today
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Create your account and start managing your tasks efficiently with our modern and intuitive platform.
          </p>
          <div style={{ marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>✨</span>
              <span>Easy to get started</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🔒</span>
              <span>Secure and encrypted</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🚀</span>
              <span>Boost your productivity</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{
          flex: 1,
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo/Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '28px',
              color: '#333',
              marginBottom: '10px'
            }}>
              Create Account
            </h2>
            <p style={{
              color: '#666',
              fontSize: '14px'
            }}>
              Fill in your details to get started
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#fee',
              borderLeft: '4px solid #f44',
              borderRadius: '0 12px 12px 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px'
              }}>
                <AlertCircle style={{
                  width: '20px',
                  height: '20px',
                  color: '#c33',
                  flexShrink: 0,
                  marginTop: '2px'
                }} />
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#800',
                    margin: 0
                  }}>
                    Registration Failed
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#a00',
                    marginTop: '4px',
                    margin: 0
                  }}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px'
              }}>
                Username
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={50}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="john_doe"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px'
              }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 8 characters"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '15px',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {formData.password && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%',
                      backgroundColor: passwordStrength === 'strong' ? '#22c55e' : passwordStrength === 'medium' ? '#eab308' : '#ef4444',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: passwordStrength === 'strong' ? '#22c55e' : passwordStrength === 'medium' ? '#eab308' : '#ef4444'
                  }}>
                    {passwordStrength === 'strong' ? 'Strong' : passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 500,
                fontSize: '14px'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: '45px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#22c55e'
                  }} />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                marginTop: '10px',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '25px',
              color: '#666',
              fontSize: '14px'
            }}>
              Already have an account?{' '}
              <Link 
                href="/login"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Sign in now →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}