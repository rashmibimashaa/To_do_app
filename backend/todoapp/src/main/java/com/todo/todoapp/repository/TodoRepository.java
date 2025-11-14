package com.todo.todoapp.repository;

import com.todo.todoapp.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    // Find all todos for a specific user
    List<Todo> findByUserId(Long userId);

    // Find a specific todo by id and user id (for security)
    Optional<Todo> findByIdAndUserId(Long id, Long userId);

    // Find completed todos for a user
    List<Todo> findByUserIdAndCompleted(Long userId, Boolean completed);

    // Count todos for a user
    long countByUserId(Long userId);

    // Delete todo by id and user id (for security)
    void deleteByIdAndUserId(Long id, Long userId);
}