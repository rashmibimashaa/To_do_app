// src/lib/api.ts

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://todoapp-backend-kqjw.onrender.com'}/api`;

// Debug logs
console.log('🔍 API_URL:', API_URL);
console.log('🔍 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

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

// FILE API
export const fileApi = {
  // Upload file
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return await response.json();
  },

  // Get file download URL
  getFileUrl: (filename: string) => {
    return `${API_URL}/files/download/${filename}`;
  },

  // Delete file
  deleteFile: async (filename: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/files/${filename}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
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

  // NEW: Get a specific todo by ID
  getTodoById: async (id: number) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }

    return await response.json();
  },

  // Create todo
  createTodo: async (
    title: string,
    description?: string,
    documentPath?: string,
    documentName?: string,
    dueDate?: string
  ) => {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title,
        description: description || '',
        completed: false,
        documentPath: documentPath || null,
        documentName: documentName || null,
        dueDate: dueDate || null
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    return await response.json();
  },

  // Update todo
  updateTodo: async (
    id: number,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
      documentPath?: string;
      documentName?: string;
      dueDate?: string;
    }
  ) => {
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

  // NEW: Toggle todo completion
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

  // NEW: Get completed todos only
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

  // NEW: Get incomplete todos only
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
