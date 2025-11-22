// src/lib/api.ts

import axios from 'axios';
import type { 
  LoginRequest, 
  RegisterRequest, 
  TodoFormData,
  ApiResponse,
  LoginResponse,
  User,
  Todo,
  PaginatedTodos
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
};

// Todo APIs
export const todoApi = {
  getAll: async (params?: { 
    status?: 'pending' | 'completed' | 'all';
    page?: number;
    size?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await api.get<ApiResponse<PaginatedTodos>>('/todos', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data;
  },

  create: async (data: TodoFormData) => {
    const response = await api.post<ApiResponse<Todo>>('/todos', data);
    return response.data;
  },

  update: async (id: number, data: Partial<TodoFormData>) => {
    const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/todos/${id}`);
    return response.data;
  },

  toggle: async (id: number) => {
    const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`);
    return response.data;
  },
};

export default api;