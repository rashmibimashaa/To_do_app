'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle, Save, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const todoId = params.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch todo from backend
  useEffect(() => {
    const token = localStorage.getItem('token'); // JWT token
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTodo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch todo');
        }

        const data = await res.json();
        setFormData({
          title: data.data.title,
          description: data.data.description,
          priority: data.data.priority,
          dueDate: data.data.dueDate.split('T')[0] // yyyy-mm-dd
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTodo();
  }, [todoId, router]);

  // Handle update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token'); // JWT token
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: new Date(formData.dueDate).toISOString()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update todo');

      router.push('/dashboard'); // navigate after success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </>
    );
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Navbar />

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 20px',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
          minHeight: '550px',
          flexDirection: typeof window !== 'undefined' && window.innerWidth < 768 ? 'column' : 'row',
        }}>
          {/* LEFT PANEL */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <button onClick={() => router.push('/dashboard')} style={{
              marginBottom: '20px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              opacity: 0.9
            }}>
              <ArrowLeft style={{ width: 20 }} /> &nbsp; Back
            </button>

            <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '15px' }}>Edit Task</h1>
            <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.6 }}>
              Update task information, priority and deadlines.
            </p>
          </div>

          {/* RIGHT PANEL (FORM) */}
          <div style={{
            flex: 1,
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <h2 style={{
              fontSize: '28px',
              textAlign: 'center',
              fontWeight: 700,
              marginBottom: '30px',
              color: '#333',
            }}>
              Update Task Details
            </h2>

            {error && (
              <div style={{
                marginBottom: '25px',
                padding: '16px',
                backgroundColor: '#fee',
                borderLeft: '4px solid #f44',
                borderRadius: '0 12px 12px 0',
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <AlertCircle style={{ color: '#d00', width: 22 }} />
                  <p style={{ margin: 0, color: '#a00' }}>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    marginTop: '6px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Description</label>
                <textarea
                  rows={4}
                  placeholder="Add more details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    marginTop: '6px',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      marginTop: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      marginTop: '6px',
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%',
                marginTop: '30px',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: '0.25s',
              }}>
                {loading ? 'Updating...' : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save className="w-5 h-5" /> Update Task
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
