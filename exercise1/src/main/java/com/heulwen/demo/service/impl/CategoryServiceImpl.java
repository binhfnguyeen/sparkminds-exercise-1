package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.request.CategoryRequest;
import com.heulwen.demo.dto.response.BookResponse;
import com.heulwen.demo.dto.response.BooksCategoryResponse;
import com.heulwen.demo.dto.response.CategoryResponse;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.mapper.BookMapper;
import com.heulwen.demo.mapper.CategoryMapper;
import com.heulwen.demo.model.Book;
import com.heulwen.demo.model.Category;
import com.heulwen.demo.repository.BookRepository;
import com.heulwen.demo.repository.CategoryRepository;
import com.heulwen.demo.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        Category category = Category.builder()
                .name(request.getName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return CategoryMapper.map(categoryRepository.save(category));
    }

    @Override
    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(CategoryMapper::map).toList();
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        CategoryMapper.map(request, category);
        category.setUpdatedAt(LocalDateTime.now());
        return CategoryMapper.map(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        categoryRepository.delete(category);
    }

    @Override
    public BooksCategoryResponse getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        List<Book> books = category.getBooks();

        BooksCategoryResponse res = new BooksCategoryResponse();
        res.setCategoryId(category.getId());
        res.setName(category.getName());

        List<BookResponse> bookResponses = books.stream()
                .filter(book -> !book.isDeleted())
                .map(BookMapper::map)
                .toList();

        res.setBooks(bookResponses);

        return res;
    }
}
