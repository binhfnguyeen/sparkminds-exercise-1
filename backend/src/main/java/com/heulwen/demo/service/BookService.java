package com.heulwen.demo.service;

import com.heulwen.demo.dto.request.BookCreateRequest;
import com.heulwen.demo.dto.request.BookUpdateRequest;
import com.heulwen.demo.dto.response.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {
    Page<BookResponse> searchBooks(String keyword, Long categoryId, String fromTimeStr, String toTimeStr,
                                   int page, int size, String sortBy, String sortDir);
    List<BookResponse> importBooksFromCsv(MultipartFile file);
    BookResponse createBook(BookCreateRequest request);
    Page<BookResponse> getAllBooks(int page, int size);
    BookResponse getBookById(Long id);
    BookResponse updateBook(Long id, BookUpdateRequest request);
    void deleteBook(Long id);
}
