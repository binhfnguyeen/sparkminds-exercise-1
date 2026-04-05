package com.heulwen.demo.controller;

import com.heulwen.demo.dto.request.CategoryRequest;
import com.heulwen.demo.dto.response.CategoryResponse;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.CategoryService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.SystemConfigService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CategoryService categoryService;

    // Các mock dùng để bypass Security & Filter Configs
    @MockitoBean private SystemConfigService systemConfigService;
    @MockitoBean private JpaMetamodelMappingContext jpaMappingContext;
    @MockitoBean private JwtService jwtService;
    @MockitoBean private AuthService authService;

    private CategoryResponse mockCategoryResponse;

    @BeforeEach
    void setUp() {
        mockCategoryResponse = new CategoryResponse();
        mockCategoryResponse.setId(1L);
        mockCategoryResponse.setName("Programming");
    }

    @Test
    void createCategory_Success() throws Exception {
        CategoryRequest request = new CategoryRequest();
        request.setName("Programming");

        Mockito.when(categoryService.create(any(CategoryRequest.class))).thenReturn(mockCategoryResponse);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.result.name").value("Programming"));
    }

    @Test
    void getCategories_Success() throws Exception {
        Mockito.when(categoryService.getAll()).thenReturn(List.of(mockCategoryResponse));

        mockMvc.perform(get("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.result[0].name").value("Programming"));
    }

    @Test
    void deleteCategory_Success() throws Exception {
        Mockito.doNothing().when(categoryService).delete(1L);

        mockMvc.perform(delete("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Deleted category successful"));
    }
}