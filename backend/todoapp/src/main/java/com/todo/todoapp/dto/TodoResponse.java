package com.todo.todoapp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.todo.todoapp.entity.Todo;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TodoResponse {
    private Long id;
    private String title;
    private String description;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String documentPath;
    private String documentName;

    // Calender feature - Due date field
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;

    // Constructor to convert Todo entity to TodoResponse
    public TodoResponse(Todo todo) {
        this.id = todo.getId();
        this.title = todo.getTitle();
        this.description = todo.getDescription();
        this.completed = todo.getCompleted();
        this.createdAt = todo.getCreatedAt();
        this.updatedAt = todo.getUpdatedAt();
        this.documentPath = todo.getDocumentPath();
        this.documentName = todo.getDocumentName();
        this.dueDate = todo.getDueDate(); // ADD THIS
    }
}