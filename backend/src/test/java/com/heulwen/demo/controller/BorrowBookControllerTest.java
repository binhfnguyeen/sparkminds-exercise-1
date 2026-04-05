package com.heulwen.demo.controller;

import com.heulwen.demo.service.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Không load toàn bộ app, nhưng vẫn load toàn bộ tầng Web
// Tầng web gồm: controller, filter, security, global exception,
@WebMvcTest(BorrowBookController.class)
@AutoConfigureMockMvc(addFilters = false)
class BorrowBookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BorrowBookService borrowBookService;

    @MockitoBean
    private SystemConfigService systemConfigService;

    @MockitoBean
    private JpaMetamodelMappingContext jpaMappingContext;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AuthService authService;

    @Test
    void borrowBook_Success() throws Exception {
        // Arrange
        String mockToken = "Bearer mock-jwt-token";
        Long bookId = 1L;
        Mockito.doNothing().when(borrowBookService).borrowBook(eq(mockToken), eq(bookId));

        // Act & Assert
        mockMvc.perform(post("/api/books/{book_id}/borrow", bookId)
                        .header("Authorization", mockToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Borrow book successfully"));
    }

    @Test
    void approveBorrowRequest_Success() throws Exception {
        // Arrange
        Long borrowId = 100L;
        Mockito.doNothing().when(borrowBookService).approveBorrowRequest(borrowId);

        // Act & Assert
        mockMvc.perform(put("/api/borrow/{borrow_id}/approve", borrowId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Approve borrow request successfully"));
    }

    @Test
    void returnBook_Success() throws Exception {
        // Arrange
        Long borrowId = 100L;
        Mockito.doNothing().when(borrowBookService).returnBook(borrowId);

        // Act & Assert
        mockMvc.perform(put("/api/borrow/{borrow_id}/return", borrowId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Return book successfully"));
    }
}