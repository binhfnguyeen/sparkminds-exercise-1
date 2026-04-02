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
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
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
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookServiceImpl implements BookService {

    BookRepository bookRepository;
    CategoryRepository categoryRepository;
    long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @Override
    public Page<BookResponse> searchBooks(String keyword, Long categoryId, String fromTimeStr, String toTimeStr,
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

        Page<Book> books = bookRepository.findAll(BookSpecification.searchBooks(keyword, categoryId, fromTime, toTime), pageable);

        return books.map(BookMapper::map);
    }

    @Override
    @Transactional
    public List<BookResponse> importBooksFromCsv(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
            throw new AppException(ErrorCode.INVALID_FILE_FORMAT);
        }

        List<Book> books = new ArrayList<>();

        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)
        ) {
            String[] line;
            csvReader.readNext();
            while ((line = csvReader.readNext()) != null) {
                if (line.length < 6) continue;
                BookCreateRequest request = BookCreateRequest.builder()
                        .title(line[0].trim())
                        .author(line[1].trim())
                        .description(line[2].trim())
                        .quantity(Integer.parseInt(line[3].trim()))
                        .imgUrl(line[4].trim())
                        .categoryId(Long.parseLong(line[5].trim()))
                        .build();
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
                books.add(book);
            }
            bookRepository.saveAll(books);
            return books.stream()
                    .map(BookMapper::map)
                    .toList();

        } catch (IOException | CsvValidationException e) {
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
