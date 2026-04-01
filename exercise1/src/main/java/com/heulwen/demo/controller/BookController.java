package com.heulwen.demo.controller;

import com.heulwen.demo.dto.request.BookCreateRequest;
import com.heulwen.demo.dto.request.BookUpdateRequest;
import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.dto.response.BookResponse;
import com.heulwen.demo.service.BookService;
import com.heulwen.demo.service.FileStorageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BookController {

    FileStorageService fileStorageService;
    BookService bookService;

    @GetMapping("/books/search")
    public ApiResponse<Page<BookResponse>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String fromTime,
            @RequestParam(required = false) String toTime,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        return ApiResponse.<Page<BookResponse>>builder()
                .code(1000)
                .message("Get books successful")
                .result(bookService.searchBooks(keyword, fromTime, toTime, page, size, sortBy, sortDir))
                .build();
    }

    @PostMapping(value = "/books/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<List<BookResponse>> importBooks(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<List<BookResponse>>builder()
                .code(1000)
                .message("Import csv successful")
                .result(bookService.importBooksFromCsv(file))
                .build();
    }

    @PostMapping(value = "/books", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<BookResponse> createBook(
            @RequestPart("data") BookCreateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            request.setImgUrl("http://localhost:8081/images/" + fileName);
        }

        return ApiResponse.<BookResponse>builder()
                .code(1000)
                .message("Create book successfully")
                .result(bookService.createBook(request))
                .build();
    }

    @PutMapping(value = "/books/{book_id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<BookResponse> updateBook(
            @PathVariable("book_id") Long id,
            @RequestPart("data") BookUpdateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            request.setImgUrl("http://localhost:8081/images/" + fileName);
        }

        return ApiResponse.<BookResponse>builder()
                .code(1000)
                .message("Update book successfully")
                .result(bookService.updateBook(id, request))
                .build();
    }

    @GetMapping("/books/{book_id}")
    public ApiResponse<BookResponse> getBook(@PathVariable("book_id") Long id) {
        return ApiResponse.<BookResponse>builder()
                .code(1000)
                .message("Get book successful")
                .result(bookService.getBookById(id))
                .build();
    }

    @GetMapping("/books")
    public ApiResponse<Page<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<Page<BookResponse>>builder()
                .code(1000)
                .message("Get all books successful")
                .result(bookService.getAllBooks(page, size))
                .build();
    }

    @DeleteMapping("/books/{book_id}")
    public ApiResponse<String> deleteBook(@PathVariable("book_id") Long id) {
        bookService.deleteBook(id);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete book successful")
                .build();
    }
}
