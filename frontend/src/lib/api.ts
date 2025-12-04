// src/lib/api.ts

const API_URL = 'http://localhost:8080/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const authApi = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw { response: { status: response.status, data: error } };
    }

    const result = await response.json();
    return { success: true, data: result };
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw { response: { status: response.status, data: error } };
    }

    return await response.json();
  }
};

export const todoApi = {
  // Get all todos
  getAllTodos: async () => {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    return await response.json();
  },

  // Create todo
  createTodo: async (title: string, description?: string) => {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title,
        description: description || '',
        completed: false
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    return await response.json();
  },

  // Update todo
  updateTodo: async (id: number, data: { title?: string; description?: string; completed?: boolean }) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    return await response.json();
  },

  // Toggle todo completion
  toggleTodo: async (id: number) => {
    const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to toggle todo');
    }

    return await response.json();
  },

  // Delete todo
  deleteTodo: async (id: number) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    return await response.json();
  },

  // Get completed todos
  getCompletedTodos: async () => {
    const response = await fetch(`${API_URL}/todos/completed`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch completed todos');
    }

    return await response.json();
  },

  // Get incomplete todos
  getIncompleteTodos: async () => {
    const response = await fetch(`${API_URL}/todos/incomplete`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch incomplete todos');
    }

    return await response.json();
  }
};