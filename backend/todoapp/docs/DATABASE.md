# Database Schema Design - ToDo Application

## Overview
This document describes the database structure for our ToDo application with JWT authentication.

---

## Database Information
- **Database Name:** tododb
- **Database Type:** PostgreSQL
- **Port:** 5432

---

## Tables

### 1. Users Table

Stores user account information with authentication credentials.

**Table Name:** `users`

| Column Name | Data Type    | Constraints                  | Description                          |
|-------------|--------------|------------------------------|--------------------------------------|
| id          | BIGSERIAL    | PRIMARY KEY                  | Auto-incrementing user ID            |
| username    | VARCHAR(50)  | UNIQUE, NOT NULL            | Unique username for login            |
| email       | VARCHAR(100) | UNIQUE, NOT NULL            | User's email address                 |
| password    | VARCHAR(255) | NOT NULL                    | BCrypt hashed password               |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Account creation timestamp           |

**Indexes:**
- Primary Key on `id`
- Unique index on `username`
- Unique index on `email`

**Business Rules:**
- Username must be 3-50 characters
- Email must be valid format
- Password must be at least 6 characters (before hashing)
- Passwords are stored using BCrypt encryption

---

### 2. Todos Table

Stores individual todo items associated with users.

**Table Name:** `todos`

| Column Name | Data Type    | Constraints                      | Description                          |
|-------------|--------------|----------------------------------|--------------------------------------|
| id          | BIGSERIAL    | PRIMARY KEY                      | Auto-incrementing todo ID            |
| title       | VARCHAR(255) | NOT NULL                        | Todo title/summary                   |
| description | TEXT         | NULL                            | Detailed description (optional)      |
| completed   | BOOLEAN      | NOT NULL, DEFAULT FALSE         | Completion status                    |
| user_id     | BIGINT       | NOT NULL, FOREIGN KEY(users.id) | Reference to owner user              |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP       | Todo creation timestamp              |
| updated_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP       | Last update timestamp                |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `user_id` references `users(id)`
- Index on `user_id` (for faster queries)
- Index on `completed` (for filtering)

**Business Rules:**
- Title is required, max 255 characters
- Description is optional, unlimited text
- Each todo belongs to exactly one user
- Todos are deleted when user is deleted (CASCADE)

---

## Relationships

### User → Todos (One-to-Many)
```
users (1) ──────< (many) todos
```

**Relationship Description:**
- One user can have many todos
- Each todo belongs to exactly one user
- When a user is deleted, all their todos are automatically deleted (ON DELETE CASCADE)

**Implementation:**
- Foreign key `user_id` in `todos` table
- References `id` in `users` table
- Cascade delete enabled

---

## SQL Schema (PostgreSQL)
```sql
-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Todos Table
CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create Indexes for Performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
```

---

## Sample Data Flow

### 1. User Registration
```
User submits: {username, email, password}
↓
Password is hashed using BCrypt
↓
User record created in users table
↓
Return success message
```

### 2. User Login
```
User submits: {username, password}
↓
Fetch user from database by username
↓
Verify password using BCrypt
↓
Generate JWT token
↓
Return token to user
```

### 3. Create Todo
```
User sends: {title, description} + JWT token
↓
Verify JWT token → extract user_id
↓
Create todo with user_id
↓
Return created todo
```

### 4. Get User's Todos
```
User sends: GET request + JWT token
↓
Verify JWT token → extract user_id
↓
Query: SELECT * FROM todos WHERE user_id = ?
↓
Return only that user's todos
```

---

## Security Considerations

1. **Password Storage:**
    - Never store plain text passwords
    - Use BCrypt with salt rounds (minimum 10)
    - Passwords are one-way hashed

2. **User Isolation:**
    - JWT token contains user_id
    - All queries filter by user_id
    - Users can only access their own todos

3. **Data Validation:**
    - Username: 3-50 chars, alphanumeric
    - Email: Valid email format
    - Password: Minimum 6 characters
    - Title: Required, max 255 chars

---

## Database Connection Configuration

**Spring Boot application.properties:**
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
spring.datasource.username=todouser
spring.datasource.password=todopass123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

**Explanation:**
- `ddl-auto=update`: Automatically creates/updates tables from entities
- `show-sql=true`: Shows SQL queries in console (helpful for debugging)
- `format_sql=true`: Makes SQL queries readable

---

## Future Enhancements (Optional)

If time permits, we could add:

1. **Priority field in todos:**
    - `priority VARCHAR(10)` (LOW, MEDIUM, HIGH)

2. **Due date:**
    - `due_date TIMESTAMP`

3. **Categories/Tags:**
    - New table `tags` with many-to-many relationship

4. **User profile:**
    - `first_name`, `last_name`, `profile_picture` in users table

---

## Notes

- This schema follows standard relational database design principles
- Designed for scalability and security
- All timestamps use server time (UTC recommended)
- Foreign key constraints ensure data integrity

---

**Document Version:** 1.0
**Last Updated:** [13.11.2025]
**Authors:** Rashmi & Ruhini