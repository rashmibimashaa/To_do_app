package com.todo.todoapp.controller;

import com.todo.todoapp.dto.TodoRequest;
import com.todo.todoapp.dto.TodoResponse;
import com.todo.todoapp.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoService todoService;

    // GET all todos for logged-in user
    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(Authentication authentication) {
        String username = authentication.getName();
        List<TodoResponse> todos = todoService.getAllTodosByUser(username);
        return ResponseEntity.ok(todos);
    }

    // GET a specific todo by id
    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        TodoResponse todo = todoService.getTodoById(id, username);
        return ResponseEntity.ok(todo);
    }

    // POST create new todo
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody TodoRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        TodoResponse todo = todoService.createTodo(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(todo);
    }

    // PUT update todo
    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        TodoResponse todo = todoService.updateTodo(id, request, username);
        return ResponseEntity.ok(todo);
    }

    // PATCH toggle todo completion
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodoCompletion(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        TodoResponse todo = todoService.toggleTodoCompletion(id, username);
        return ResponseEntity.ok(todo);
    }

    // DELETE todo
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTodo(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        todoService.deleteTodo(id, username);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Todo deleted successfully");
        return ResponseEntity.ok(response);
    }

    // GET completed todos only
    @GetMapping("/completed")
    public ResponseEntity<List<TodoResponse>> getCompletedTodos(Authentication authentication) {
        String username = authentication.getName();
        List<TodoResponse> todos = todoService.getCompletedTodos(username);
        return ResponseEntity.ok(todos);
    }

    // GET incomplete todos only
    @GetMapping("/incomplete")
    public ResponseEntity<List<TodoResponse>> getIncompleteTodos(Authentication authentication) {
        String username = authentication.getName();
        List<TodoResponse> todos = todoService.getIncompleteTodos(username);
        return ResponseEntity.ok(todos);
    }
}