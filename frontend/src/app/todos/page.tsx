"use client";
import { useState, useEffect } from "react";
import { todoApi, fileApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Helper function to format date for backend (yyyy-MM-dd'T'HH:mm:ss)
const formatDateForBackend = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
  documentPath?: string;
  documentName?: string;
  dueDate?: string;
  createdAt?: string;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState(""); // NEW
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingDescription, setEditingDescription] = useState(""); // NEW
  const [editingDueDate, setEditingDueDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadTodos();
  }, [filter]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      console.log('Loading todos with filter:', filter);

      let data;
      if (filter === 'completed') {
        data = await todoApi.getCompletedTodos();
      } else if (filter === 'active') {
        data = await todoApi.getIncompleteTodos();
      } else {
        data = await todoApi.getAllTodos();
      }

      console.log('Todos loaded:', data);
      setTodos(data);
      setError("");
    } catch (err: any) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos. Please try logging in again.');

      if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new todo with description
  const handleAdd = async () => {
    if (!newTodo.trim()) return;

    try {
      let documentPath = null;
      let documentName = null;

      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        console.log('Uploading file:', selectedFile.name);
        const uploadResult = await fileApi.uploadFile(selectedFile);
        console.log('File uploaded:', uploadResult);
        documentPath = uploadResult.documentPath;
        documentName = uploadResult.documentName;
        setUploading(false);
      }

      // Format due date for backend
      const dueDateISO = dueDate ? formatDateForBackend(dueDate) : undefined;

      console.log('Creating todo:', { title: newTodo, description: newDescription, dueDate: dueDateISO });
      const newItem = await todoApi.createTodo(newTodo, newDescription, documentPath, documentName, dueDateISO);
      console.log('Todo created:', newItem);
      setTodos([...todos, newItem]);
      setNewTodo("");
      setNewDescription(""); // Reset description
      setSelectedFile(null);
      setDueDate(null);
      setError("");
    } catch (err: any) {
      console.error('Error creating todo:', err);
      setError('Failed to create todo: ' + (err.message || 'Unknown error'));
      setUploading(false);
    }
  };

  // Toggle todo completion
  const handleToggleComplete = async (id: number) => {
    try {
      console.log('Toggling todo completion:', id);
      const updatedTodo = await todoApi.toggleTodo(id);
      console.log('Todo toggled:', updatedTodo);

      // Update local state
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));

      setError("");
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Failed to toggle todo');
    }
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting todo:', id);
      await todoApi.deleteTodo(id);
      console.log('Todo deleted');
      setTodos(todos.filter((todo) => todo.id !== id));
      setError("");
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    }
  };

  // Start editing with description
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
    setEditingDescription(todo.description || ""); // NEW
    setEditingDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
  };

  // Save edited todo with description
  const saveEdit = async (id: number) => {
    if (!editingText.trim()) return;

    try {
      const dueDateISO = editingDueDate ? formatDateForBackend(editingDueDate) : undefined;

      console.log('Updating todo:', id, editingText, editingDescription, dueDateISO);
      await todoApi.updateTodo(id, {
        title: editingText,
        description: editingDescription, // NEW
        dueDate: dueDateISO
      });

      setTodos(todos.map((t) =>
        t.id === id
          ? { ...t, title: editingText, description: editingDescription, dueDate: dueDateISO }
          : t
      ));

      setEditingId(null);
      setEditingText("");
      setEditingDescription(""); // NEW
      setEditingDueDate(null);
      setError("");
    } catch (err: any) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo: ' + (err.message || 'Unknown error'));
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingDescription(""); // NEW
    setEditingDueDate(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Helper function to check if todo is overdue
  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Calculate stats
  const totalTodos = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-700">Loading todos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* styles for calendar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .react-datepicker-popper {
            z-index: 99999 !important;
            position: fixed !important;
          }
          .react-datepicker {
            z-index: 99999 !important;
            position: relative !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4) !important;
            border: 3px solid #667eea !important;
          }
        `
      }} />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
      </div>

      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Todos
              </h1>
              <p className="text-gray-600 text-sm mt-1">Manage your tasks</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg border-2 border-red-200 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-semibold">Logout</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/80 backdrop-blur-lg p-2 rounded-2xl shadow-lg border border-white/20 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({totalTodos})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                filter === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* UPDATED: Add Todo Card with Description */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-6" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex flex-col space-y-3">
            {/* Title Input */}
            <div className="flex space-x-3">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Add new todo..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700 placeholder-gray-400"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !selectedFile && !dueDate && handleAdd()}
                />
              </div>
            </div>

            {/* NEW: Description Input */}
            <div className="flex space-x-3">
              <div className="flex-1 relative group">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <textarea
                  placeholder="Add description (optional)..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700 placeholder-gray-400 resize-none"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Date Picker and File Input Row */}
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative" style={{ zIndex: 100 }}>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  showTimeSelect
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Set due date (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700"
                  minDate={new Date()}
                  withPortal
                  portalId="root-portal"
                />
                {dueDate && (
                  <button
                    onClick={() => setDueDate(null)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    style={{ zIndex: 101 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <label className="flex-1 relative cursor-pointer">
                <div className="flex items-center space-x-3 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-all">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm text-gray-600 truncate">
                    {selectedFile ? selectedFile.name : 'Attach file'}
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
              </label>

              {selectedFile && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                >
                  Remove
                </button>
              )}

              <button
                onClick={handleAdd}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* UPDATED: Todos List with Description */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white/80 backdrop-blur-lg p-5 rounded-xl shadow-lg border transition-all duration-200 group ${
                isOverdue(todo) ? 'border-red-300 bg-red-50/50' : 'border-white/20'
              } hover:shadow-xl ${todo.completed ? 'opacity-75' : ''}`}
            >
              {editingId === todo.id ? (
                <div className="flex flex-col space-y-3">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    autoFocus
                  />
                  {/* NEW: Description textarea in edit mode */}
                  <textarea
                    className="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700 resize-none"
                    placeholder="Add description..."
                    rows={2}
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                  <div style={{ zIndex: 100 }}>
                    <DatePicker
                      selected={editingDueDate}
                      onChange={(date) => setEditingDueDate(date)}
                      showTimeSelect
                      dateFormat="MMM d, yyyy h:mm aa"
                      placeholderText="Set due date"
                      className="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700"
                      minDate={new Date()}
                      withPortal
                      portalId="root-portal"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center space-x-2 bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      {/* Checkbox to toggle completion */}
                      <button
                        onClick={() => handleToggleComplete(todo.id)}
                        className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all ${
                          todo.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {todo.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className={`text-gray-800 font-medium text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </span>

                        {/* NEW: Description Display */}
                        {todo.description && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {todo.description}
                          </p>
                        )}

                        {/* Due Date Display */}
                        {todo.dueDate && (
                          <div className={`flex items-center space-x-1 mt-1 text-sm ${
                            isOverdue(todo) ? 'text-red-600 font-semibold' : 'text-gray-600'
                          }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {isOverdue(todo) && '⚠️ '}
                              Due: {formatDate(todo.dueDate)}
                            </span>
                          </div>
                        )}

                        {/* Document Display */}
                        {todo.documentName && (
                          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <a
                              href={fileApi.getFileUrl(todo.documentPath!)}
                              download={todo.documentName}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {todo.documentName}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEditing(todo)}
                        className="flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="flex items-center space-x-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg p-12 rounded-2xl shadow-xl border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'completed' ? 'No completed todos' : filter === 'active' ? 'No active todos' : 'No todos yet'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Add your first todo to get started!' : `Switch to "All" to see all your todos`}
            </p>
          </div>
        )}

        {/* Stats Card */}
        <div className="mt-6 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Progress</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {completedCount} / {totalTodos}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {totalTodos > 0 ? `${Math.round((completedCount / totalTodos) * 100)}% Complete` : 'Get started! 🚀'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Stay productive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}