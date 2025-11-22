// src/app/login/page.tsxnpm run dev


'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
        minHeight: '500px',
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
            Manage your tasks efficiently
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Welcome back! Sign in to access your personalized dashboard and stay on top of your productivity.
          </p>
          <div style={{ marginTop: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>⚡</span>
              <span>Fast and responsive</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🔒</span>
              <span>Secure and private</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>✨</span>
              <span>Simple and intuitive</span>
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
              Welcome Back
            </h2>
            <p style={{
              color: '#666',
              fontSize: '14px'
            }}>
              Sign in to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              marginBottom: '25px',
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
                    Authentication Failed
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
            {/* Email Field */}
            <div style={{ marginBottom: '25px' }}>
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
                placeholder="Enter your email"
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
            <div style={{ marginBottom: '25px' }}>
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Signup Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '25px',
              color: '#666',
              fontSize: '14px'
            }}>
              Don't have an account?{' '}
              <Link 
                href="/register"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Create one now →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}