package com.heulwen.demo.controller;

import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.dto.response.BorrowBookResponse;
import com.heulwen.demo.dto.response.PageResponse;
import com.heulwen.demo.model.enumType.BorrowStatus;
import com.heulwen.demo.service.BorrowBookService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BorrowBookController {

    BorrowBookService borrowBookService;

    @PostMapping("/books/{book_id}/borrow")
    public ApiResponse<String> borrowBook(@RequestHeader("Authorization") String authHeader, @PathVariable("book_id") Long book_id){
        borrowBookService.borrowBook(authHeader, book_id);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Borrow book successfully")
                .build();
    }

    @GetMapping("/borrow/books")
    public ApiResponse<List<BorrowBookResponse>> listBorrowBook(@RequestHeader("Authorization") String authHeader){
        return ApiResponse.<List<BorrowBookResponse>>builder()
                .code(1000)
                .message("Get list borrow successfully")
                .result(borrowBookService.getBorrowedBooks(authHeader))
                .build();
    }

    @PutMapping("/borrow/{borrow_id}/approve")
    public ApiResponse<String> approveBorrowRequest(@PathVariable("borrow_id") Long borrowId){
        borrowBookService.approveBorrowRequest(borrowId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Approve borrow request successfully")
                .build();
    }

    @PutMapping("/borrow/{borrow_id}/reject")
    public ApiResponse<String> rejectBorrowRequest(@PathVariable("borrow_id") Long bookId){
        borrowBookService.rejectBorrowRequest(bookId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Reject borrow request successfully")
                .build();
    }

    @PutMapping("/borrow/{borrow_id}/return")
    public ApiResponse<String> returnBook(@PathVariable("borrow_id") Long borrowId){
        borrowBookService.returnBook(borrowId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Return book successfully")
                .build();
    }

    @GetMapping("/admin/borrow/books/search")
    public ApiResponse<PageResponse<BorrowBookResponse>> searchBorrowRecordsAdmin(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "status", required = false) BorrowStatus status,
            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(pattern = "ddMMyyyy HHmmss") LocalDateTime fromDate,
            @RequestParam(value = "toDate", required = false) @DateTimeFormat(pattern = "ddMMyyyy HHmmss") LocalDateTime toDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir
    ) {
        return ApiResponse.<PageResponse<BorrowBookResponse>>builder()
                .code(1000)
                .message("Search borrow records successfully")
                .result(borrowBookService.searchBorrowRecordsAdmin(email, title, status, fromDate, toDate, page, size, sortBy, sortDir))
                .build();
    }
}
