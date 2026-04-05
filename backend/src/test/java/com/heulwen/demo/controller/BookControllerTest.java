package com.heulwen.demo.controller;

import com.heulwen.demo.dto.request.BookCreateRequest;
import com.heulwen.demo.dto.response.BookResponse;
import com.heulwen.demo.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
@AutoConfigureMockMvc(addFilters = false)
public class BookControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @MockitoBean
    private SystemConfigService systemConfigService;

    @MockitoBean
    private JpaMetamodelMappingContext jpaMappingContext;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private BookResponse mockBookResponse;

    @BeforeEach
    void setUp() {
        mockBookResponse = new BookResponse();
        mockBookResponse.setId(1L);
        mockBookResponse.setTitle("Spring Boot in Action");
    }

    @Test
    void getBook_Success() throws Exception {
        // Arrange
        Mockito.when(bookService.getBookById(1L)).thenReturn(mockBookResponse);

        // Act & Assert
        mockMvc.perform(get("/api/books/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Get book successful"))
                .andExpect(jsonPath("$.result.id").value(1))
                .andExpect(jsonPath("$.result.title").value("Spring Boot in Action"));
    }

    @Test
    void deleteBook_Success() throws Exception {
        // Arrange
        Mockito.doNothing().when(bookService).deleteBook(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/books/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Delete book successful"));
    }

    @Test
    void createBook_Success_WithFile() throws Exception {
        // Arrange
        BookCreateRequest request = new BookCreateRequest();
        // request.setTitle("Spring Boot in Action"); // Tùy thuộc vào các field trong dto

        // Mock phần JSON data (giả lập @RequestPart("data"))
        MockMultipartFile dataFile = new MockMultipartFile(
                "data",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsBytes(request)
        );

        // Mock phần file upload (giả lập @RequestPart("file"))
        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "image.png",
                MediaType.IMAGE_PNG_VALUE,
                "dummy-image-content".getBytes()
        );

        Mockito.when(fileStorageService.storeFile(any())).thenReturn("image.png");
        Mockito.when(bookService.createBook(any(BookCreateRequest.class))).thenReturn(mockBookResponse);

        // Act & Assert
        mockMvc.perform(multipart("/api/books")
                        .file(dataFile)
                        .file(imageFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Create book successfully"))
                .andExpect(jsonPath("$.result.id").value(1));
    }
}
