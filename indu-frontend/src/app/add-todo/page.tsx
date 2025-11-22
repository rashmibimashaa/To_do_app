'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AddTodoPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with your backend POST API
      await new Promise((res) => setTimeout(res, 800));

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);

    } catch (err: any) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 20px',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            display: 'flex',
            width: '100%',
            overflow: 'hidden',
            minHeight: '550px',
            flexDirection: typeof window !== 'undefined' && window.innerWidth < 768 ? 'column' : 'row',
          }}
        >
          {/* LEFT PANEL */}
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '60px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '15px' }}>
              Create a New Task
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.6 }}>
              Stay organized and productive by adding tasks with priority and deadlines.
            </p>

            <div style={{ marginTop: '40px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', marginBottom: '20px',
                fontSize: '16px'
              }}>
                <span style={{ fontSize: '26px', marginRight: '12px' }}>📝</span>
                <span>Easy task creation</span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', marginBottom: '20px',
                fontSize: '16px'
              }}>
                <span style={{ fontSize: '26px', marginRight: '12px' }}>📅</span>
                <span>Set deadlines</span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', marginBottom: '20px',
                fontSize: '16px'
              }}>
                <span style={{ fontSize: '26px', marginRight: '12px' }}>⭐</span>
                <span>Prioritize work</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL / FORM */}
          <div
            style={{
              flex: 1,
              padding: '60px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                textAlign: 'center',
                fontWeight: 700,
                marginBottom: '30px',
                color: '#333'
              }}
            >
              Add Task Details
            </h2>

            {error && (
              <div
                style={{
                  marginBottom: '25px',
                  padding: '16px',
                  backgroundColor: '#fee',
                  borderLeft: '4px solid #f44',
                  borderRadius: '0 12px 12px 0'
                }}
              >
                <div style={{ display: 'flex', gap: '10px' }}>
                  <AlertCircle style={{ color: '#d00', width: 22 }} />
                  <p style={{ margin: 0, color: '#a00' }}>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, fontSize: 14 }}>Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    marginTop: '6px'
                  }}
                />
              </div>

              {/* Description */}
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
                    resize: 'none'
                  }}
                />
              </div>

              {/* Priority & Due Date */}
              <div style={{
                display: 'grid',
                gap: '20px',
                gridTemplateColumns: '1fr 1fr'
              }}>
                {/* Priority */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      marginTop: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label style={{ fontWeight: 600, fontSize: 14 }}>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px solid #e0e0e0',
                      marginTop: '6px'
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '30px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: '0.25s'
                }}
              >
                {loading ? 'Creating...' : <span className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Create Task
                </span>}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
