package com.heulwen.demo.controller;

import com.heulwen.demo.dto.request.CategoryRequest;
import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.dto.response.BooksCategoryResponse;
import com.heulwen.demo.dto.response.CategoryResponse;
import com.heulwen.demo.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryController {

    CategoryService categoryService;

    @PostMapping("/categories")
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .code(1000)
                .message("Create category successfully")
                .result(categoryService.create(request))
                .build();
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> getCategories(){
        return ApiResponse.<List<CategoryResponse>>builder()
                .code(1000)
                .message("Get categories successfully")
                .result(categoryService.getAll())
                .build();
    }

    @PutMapping("/categories/{category_id}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable Long category_id, @RequestBody CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .code(1000)
                .message("Update category successfully")
                .result(categoryService.update(category_id, request))
                .build();
    }

    @GetMapping("/categories/{category_id}")
    public ApiResponse<BooksCategoryResponse> getCategory(@PathVariable Long category_id){
        return ApiResponse.<BooksCategoryResponse>builder()
                .code(1000)
                .message("Get category successful")
                .result(categoryService.getCategory(category_id))
                .build();
    }

    @DeleteMapping("/categories/{category_id}")
    public ApiResponse<String> deleteCategory(@PathVariable Long category_id){
        categoryService.delete(category_id);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Deleted category successful")
                .build();
    }
}
