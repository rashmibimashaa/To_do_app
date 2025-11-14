# API Documentation - ToDo App

## Base URL
```
http://localhost:8080/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Table of Contents
1. Authentication Endpoints
2. Todo Endpoints
3. Data Models
4. Error Responses
5. Status Codes
6. Security Considerations
7. Testing with Postman
8. Implementation Notes
9. Frontend Integration Guide

---

## Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Authentication Required:** No

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2025-11-08T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "User already exists",
  "errors": [
    "Email is already registered"
  ]
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [
    "Email or password is incorrect"
  ]
}
```

---

## Todo Endpoints

### 3. Get All Todos (User-Specific)

**Endpoint:** `GET /api/todos`

**Description:** Retrieve all todos for the authenticated user

**Authentication Required:** Yes (JWT)

**Query Parameters (Optional):**
- `status` - Filter by status: pending, completed, all (default: all)
- `page` - Page number (default: 0)
- `size` - Items per page (default: 10)
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc, desc (default: desc)

**Example Request:**
```
GET /api/todos?status=pending&page=0&size=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todos retrieved successfully",
  "data": {
    "todos": [
      {
        "id": 1,
        "title": "Complete project documentation",
        "description": "Write API docs and setup guide",
        "status": "pending",
        "priority": "high",
        "dueDate": "2025-11-15T23:59:59Z",
        "createdAt": "2025-11-08T10:30:00Z",
        "updatedAt": "2025-11-08T10:30:00Z"
      },
      {
        "id": 2,
        "title": "Review pull requests",
        "description": "Check team's code submissions",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2025-11-10T17:00:00Z",
        "createdAt": "2025-11-08T11:15:00Z",
        "updatedAt": "2025-11-08T11:15:00Z"
      }
    ],
    "pagination": {
      "currentPage": 0,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

---

### 4. Get Single Todo by ID

**Endpoint:** `GET /api/todos/{id}`

**Description:** Retrieve a specific todo by its ID

**Authentication Required:** Yes (JWT)

**Path Parameters:**
- `id` - Todo ID (integer)

**Example Request:**
```
GET /api/todos/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo retrieved successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write API docs and setup guide",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-11-15T23:59:59Z",
    "createdAt": "2025-11-08T10:30:00Z",
    "updatedAt": "2025-11-08T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Todo not found",
  "errors": [
    "No todo found with ID: 1"
  ]
}
```

---

### 5. Create New Todo

**Endpoint:** `POST /api/todos`

**Description:** Create a new todo item

**Authentication Required:** Yes (JWT)

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write API docs and setup guide",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-11-15T23:59:59Z"
}
```

**Field Validations:**
- `title` - Required, 3-100 characters
- `description` - Optional, max 500 characters
- `status` - Optional, default: "pending", values: ["pending", "completed"]
- `priority` - Optional, default: "medium", values: ["low", "medium", "high"]
- `dueDate` - Optional, must be future date

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": 3,
    "title": "Complete project documentation",
    "description": "Write API docs and setup guide",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-11-15T23:59:59Z",
    "createdAt": "2025-11-08T12:00:00Z",
    "updatedAt": "2025-11-08T12:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required",
    "Title must be between 3 and 100 characters"
  ]
}
```

---

### 6. Update Todo

**Endpoint:** `PUT /api/todos/{id}`

**Description:** Update an existing todo item

**Authentication Required:** Yes (JWT)

**Path Parameters:**
- `id` - Todo ID (integer)

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "dueDate": "2025-11-20T23:59:59Z"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "priority": "low",
    "dueDate": "2025-11-20T23:59:59Z",
    "createdAt": "2025-11-08T10:30:00Z",
    "updatedAt": "2025-11-08T14:30:00Z"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied",
  "errors": [
    "You don't have permission to update this todo"
  ]
}
```

---

### 7. Delete Todo

**Endpoint:** `DELETE /api/todos/{id}`

**Description:** Delete a todo item

**Authentication Required:** Yes (JWT)

**Path Parameters:**
- `id` - Todo ID (integer)

**Example Request:**
```
DELETE /api/todos/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "data": null
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Todo not found",
  "errors": [
    "No todo found with ID: 1"
  ]
}
```

---

### 8. Toggle Todo Status

**Endpoint:** `PATCH /api/todos/{id}/toggle`

**Description:** Quick toggle between pending and completed status

**Authentication Required:** Yes (JWT)

**Path Parameters:**
- `id` - Todo ID (integer)

**Request Body:** None required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo status updated successfully",
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write API docs and setup guide",
    "status": "completed",
    "priority": "high",
    "dueDate": "2025-11-15T23:59:59Z",
    "createdAt": "2025-11-08T10:30:00Z",
    "updatedAt": "2025-11-08T15:00:00Z"
  }
}
```

---

## Data Models

### User Model
```json
{
  "id": "integer",
  "username": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (hashed, min 8 chars)",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### Todo Model
```json
{
  "id": "integer",
  "title": "string (3-100 chars, required)",
  "description": "string (max 500 chars, optional)",
  "status": "enum ['pending', 'completed']",
  "priority": "enum ['low', 'medium', 'high']",
  "dueDate": "datetime (ISO 8601, optional)",
  "userId": "integer (foreign key)",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

---

## Error Responses

### Standard Error Format
All error responses follow this structure:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Detailed error 1",
    "Detailed error 2"
  ]
}
```

### Common Error Scenarios

**Validation Error (400)**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required",
    "Email format is invalid"
  ]
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "message": "Authentication required",
  "errors": [
    "No token provided or token is invalid"
  ]
}
```

**Forbidden (403)**
```json
{
  "success": false,
  "message": "Access denied",
  "errors": [
    "You don't have permission to access this resource"
  ]
}
```

**Not Found (404)**
```json
{
  "success": false,
  "message": "Resource not found",
  "errors": [
    "The requested resource does not exist"
  ]
}
```

**Server Error (500)**
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": [
    "An unexpected error occurred. Please try again later."
  ]
}
```

---

## Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE requests |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but not authorized for action |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## Security Considerations

### JWT Token
- Format: Bearer <token>
- Location: Authorization header
- Expiration: 24 hours (86400 seconds)
- Algorithm: HS256

### Password Requirements
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Special characters recommended

### CORS Configuration
- Allowed Origins: http://localhost:3000
- Allowed Methods: GET, POST, PUT, PATCH, DELETE
- Allowed Headers: Content-Type, Authorization

---

## Testing with Postman

### Setup
1. Create a new collection: "ToDo App API"
2. Add base URL as collection variable: {{base_url}} = http://localhost:8080/api
3. Create environment for local development

### Authentication Flow
1. Register a new user and save user details
2. Login with credentials and copy JWT token
3. Set token in collection's Authorization tab as Bearer Token
4. All subsequent requests will include the token

### Sample Test Collection Structure
```
ToDo App API
  Authentication
    - Register User
    - Login User
  Todos
    - Get All Todos
    - Get Todo by ID
    - Create Todo
    - Update Todo
    - Toggle Todo Status
    - Delete Todo
```

---

## Implementation Notes for Backend Team

### Priority Order
1. User entity and repository
2. JWT authentication service
3. Registration endpoint
4. Login endpoint
5. Todo entity and repository
6. Todo CRUD endpoints
7. User-specific todo filtering
8. Validation and error handling

### Database Schema

**Users Table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Todos Table:**
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Frontend Integration Guide

### Token Storage
```javascript
// Store token after login
localStorage.setItem('token', response.data.token);

// Retrieve token for requests
const token = localStorage.getItem('token');
```

### API Service Example (axios)
```javascript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Usage Example
```javascript
// Login
const response = await api.post('/auth/login', { email, password });
localStorage.setItem('token', response.data.data.token);

// Get todos
const todos = await api.get('/todos?status=pending');

// Create todo
const newTodo = await api.post('/todos', { title, description });
```

---

## API Versioning
- Current version: v1
- Base path: /api
- Future versions will use: /api/v2, /api/v3, etc.
