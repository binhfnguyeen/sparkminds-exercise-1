package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.request.BookCreateRequest;
import com.heulwen.demo.dto.request.BookUpdateRequest;
import com.heulwen.demo.dto.response.BookResponse;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.mapper.BookMapper;
import com.heulwen.demo.model.Book;
import com.heulwen.demo.model.Category;
import com.heulwen.demo.repository.BookRepository;
import com.heulwen.demo.repository.CategoryRepository;
import com.heulwen.demo.service.BookService;
import com.heulwen.demo.specification.BookSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookServiceImpl implements BookService {

    BookRepository bookRepository;
    CategoryRepository categoryRepository;

    @Override
    public Page<BookResponse> searchBooks(String keyword, String fromTimeStr, String toTimeStr,
                                   int page, int size, String sortBy, String sortDir) {
        LocalDateTime fromTime = null;
        LocalDateTime toTime = null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy HHmmss");

        try {
            if (fromTimeStr != null && !fromTimeStr.isEmpty()) {
                fromTime = LocalDateTime.parse(fromTimeStr, formatter);
            }
            if (toTimeStr != null && !toTimeStr.isEmpty()) {
                toTime = LocalDateTime.parse(toTimeStr, formatter);
            }
        } catch (DateTimeParseException e) {
            throw new AppException(ErrorCode.INVALID_DATE_FORMAT);
        }

        if (fromTime != null && toTime != null && fromTime.isAfter(toTime)) {
            throw new AppException(ErrorCode.INVALID_DATE_RANGE);
        }

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> books = bookRepository.findAll(BookSpecification.searchBooks(keyword, fromTime, toTime), pageable);

        return books.map(BookMapper::map);
    }

    @Override
    @Transactional
    public void importBooksFromCsv(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
            throw new AppException(ErrorCode.INVALID_FILE_FORMAT);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;

            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] data = line.split(",");
                if (data.length >= 5) {
                    Long categoryId = Long.parseLong(data[4].trim());
                    Category category = categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

                    Book book = Book.builder()
                            .title(data[0].trim())
                            .author(data[1].trim())
                            .description(data[2].trim())
                            .quantity(Integer.parseInt(data[3].trim()))
                            .category(category)
                            .deleted(false)
                            .build();

                    bookRepository.save(book);
                }
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    @Override
    public BookResponse createBook(BookCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .imgUrl(request.getImgUrl())
                .category(category)
                .deleted(false)
                .build();

        return BookMapper.map(bookRepository.save(book));
    }

    @Override
    public Page<BookResponse> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findByDeletedFalse(pageable);
        return books.map(BookMapper::map);
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_EXISTED));
        return BookMapper.map(book);
    }

    @Override
    public BookResponse updateBook(Long id, BookUpdateRequest request) {
        Book book = bookRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_EXISTED));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
            book.setCategory(category);
        }
        BookMapper.map(request, book);
        return BookMapper.map(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {
        Book book = bookRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_EXISTED));

        book.setDeleted(true);
        bookRepository.save(book);
    }
}
