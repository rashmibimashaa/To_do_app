// src/components/TodoCard.tsx

import { Todo } from '@/types';
import { Calendar, Edit2, Trash2, Check } from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow ${
      todo.status === 'completed' ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            todo.status === 'completed'
              ? 'bg-green-600 border-green-600'
              : 'border-gray-300 hover:border-indigo-600'
          }`}
        >
          {todo.status === 'completed' && (
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className={`text-base font-semibold ${
              todo.status === 'completed' 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            
            {/* Badges */}
            <div className="flex gap-2 flex-shrink-0">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(todo.status)}`}>
                {todo.status}
              </span>
            </div>
          </div>

          {todo.description && (
            <p className={`text-sm mb-3 ${
              todo.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {/* Due Date */}
            {todo.dueDate && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(todo.dueDate)}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => onEdit(todo.id)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}