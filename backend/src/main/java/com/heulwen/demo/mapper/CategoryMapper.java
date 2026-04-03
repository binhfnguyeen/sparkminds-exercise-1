package com.heulwen.demo.mapper;

import com.heulwen.demo.dto.request.CategoryRequest;
import com.heulwen.demo.dto.response.CategoryResponse;
import com.heulwen.demo.model.Category;

public class CategoryMapper {

    public static Category map(CategoryRequest request){
        if (request == null){
            return null;
        }
        return Category.builder()
                .name(request.getName())
                .build();
    }

    public static CategoryResponse map(Category category){
        if (category == null){
            return null;
        }
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    public static void map(CategoryRequest request, Category category){
        if (request == null || category == null){
            return;
        }

        category.setName(request.getName());
    }
}
