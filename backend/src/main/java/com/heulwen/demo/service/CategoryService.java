package com.heulwen.demo.service;

import com.heulwen.demo.dto.request.CategoryRequest;
import com.heulwen.demo.dto.response.BooksCategoryResponse;
import com.heulwen.demo.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse create(CategoryRequest request);
    List<CategoryResponse> getAll();
    CategoryResponse update(Long id, CategoryRequest request);
    void delete(Long id);
    BooksCategoryResponse getCategory(Long id);
}
