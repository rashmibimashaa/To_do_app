package com.todo.todoapp.service;

import com.todo.todoapp.dto.TodoRequest;
import com.todo.todoapp.dto.TodoResponse;
import com.todo.todoapp.entity.Todo;
import com.todo.todoapp.entity.User;
import com.todo.todoapp.repository.TodoRepository;
import com.todo.todoapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // Get all todos for a user
    public List<TodoResponse> getAllTodosByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findByUserId(user.getId())
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }

    // Get a specific todo by id
    public TodoResponse getTodoById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));

        return new TodoResponse(todo);
    }

    // Create a new todo
    @Transactional
    public TodoResponse createTodo(TodoRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);
        return new TodoResponse(savedTodo);
    }

    // Update an existing todo
    @Transactional
    public TodoResponse updateTodo(Long id, TodoRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        Todo updatedTodo = todoRepository.save(todo);
        return new TodoResponse(updatedTodo);
    }

    // Toggle todo completion status
    @Transactional
    public TodoResponse toggleTodoCompletion(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));

        todo.setCompleted(!todo.getCompleted());

        Todo updatedTodo = todoRepository.save(todo);
        return new TodoResponse(updatedTodo);
    }

    // Delete a todo
    @Transactional
    public void deleteTodo(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found or access denied"));

        todoRepository.delete(todo);
    }

    // Get completed todos only
    public List<TodoResponse> getCompletedTodos(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findByUserIdAndCompleted(user.getId(), true)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }

    // Get incomplete todos only
    public List<TodoResponse> getIncompleteTodos(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoRepository.findByUserIdAndCompleted(user.getId(), false)
                .stream()
                .map(TodoResponse::new)
                .collect(Collectors.toList());
    }
}