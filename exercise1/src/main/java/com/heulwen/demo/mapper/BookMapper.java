package com.heulwen.demo.mapper;

import com.heulwen.demo.dto.request.BookUpdateRequest;
import com.heulwen.demo.dto.response.BookResponse;
import com.heulwen.demo.dto.response.CategoryResponse;
import com.heulwen.demo.model.Book;

public class BookMapper {
    public static BookResponse map(Book book){
        if (book == null) {
            return null;
        }

        CategoryResponse categoryResponse = null;
        if (book.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(book.getCategory().getId())
                    .name(book.getCategory().getName())
                    .build();
        }

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .quantity(book.getQuantity())
                .imgUrl(book.getImgUrl())
                .deleted(book.isDeleted())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .category(categoryResponse)
                .build();
    }

    public static void map(BookUpdateRequest request, Book book){
        if (request == null || book == null) {
            return;
        }

        if (request.getTitle() != null) {
            book.setTitle(request.getTitle());
        }

        if (request.getAuthor() != null) {
            book.setAuthor(request.getAuthor());
        }

        if (request.getDescription() != null) {
            book.setDescription(request.getDescription());
        }

        if (request.getQuantity() != null) {
            book.setQuantity(request.getQuantity());
        }

        if (request.getImgUrl() != null) {
            book.setImgUrl(request.getImgUrl());
        }
    }
}
