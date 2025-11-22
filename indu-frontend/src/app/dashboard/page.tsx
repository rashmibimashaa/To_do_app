'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Menu, Clock, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with your real token

  // Fetch todos from backend
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data.data || []); // Adjust according to your API response
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error fetching todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Toggle todo status
  const handleToggle = async (id: number) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: todo.status === 'pending' ? 'completed' : 'pending',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: data.data.status } : t))
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to toggle todo');
    }
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      alert(data.message);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete todo');
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0d5f5 0%, #dce9f7 50%, #d5e5f5 100%)',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Menu style={{ width: '24px', height: '24px', color: '#666' }} />
            </button>
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                }}
              >
                All Tasks
                <Sparkles style={{ width: '24px', height: '24px' }} />
              </h1>
              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                {loading ? 'Loading...' : `${filteredTodos.length} tasks`}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/add-todo')}
            style={{
              background: '#6366f1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            New Task
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <Search
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#9ca3af',
            }}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '16px',
              fontSize: '15px',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          />
        </div>

        {/* Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <p>Loading tasks...</p>
          ) : filteredTodos.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(todo.id)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      border: todo.status === 'completed' ? 'none' : '2px solid #d1d5db',
                      background: todo.status === 'completed' ? '#10b981' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '4px',
                    }}
                  >
                    {todo.status === 'completed' && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginBottom: '8px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: todo.status === 'completed' ? '#9ca3af' : '#1f2937',
                          textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                          margin: 0,
                        }}
                      >
                        {todo.title}
                      </h3>
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '500',
                          background:
                            todo.priority === 'high'
                              ? '#fef2f2'
                              : todo.priority === 'medium'
                              ? '#fefce8'
                              : '#f0fdf4',
                          color:
                            todo.priority === 'high'
                              ? '#dc2626'
                              : todo.priority === 'medium'
                              ? '#ca8a04'
                              : '#16a34a',
                          flexShrink: 0,
                        }}
                      >
                        {todo.priority}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '14px',
                        color: todo.status === 'completed' ? '#9ca3af' : '#6b7280',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {todo.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        <Clock style={{ width: '16px', height: '16px' }} />
                        <span>
                          Due{' '}
                          {new Date(todo.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
