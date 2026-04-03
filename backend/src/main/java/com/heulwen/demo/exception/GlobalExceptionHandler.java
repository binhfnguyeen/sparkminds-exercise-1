package com.heulwen.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<?> handleAppException(AppException ex) {
        ErrorCode code = ex.getErrorCode();

        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("code", code.getCode());
        errorBody.put("message", code.getMessage());
        errorBody.put("status", code.getStatusCode().value());
        errorBody.put("timestamp", ZonedDateTime.now());

        return ResponseEntity
                .status(code.getStatusCode())
                .body(errorBody);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String errorMessage = fieldError != null ? fieldError.getDefaultMessage() : "Validation failed";

        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("code", 1001);
        errorBody.put("message", errorMessage);
        errorBody.put("status", HttpStatus.BAD_REQUEST.value());
        errorBody.put("timestamp", ZonedDateTime.now());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorBody);
    }
}
