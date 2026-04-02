package com.heulwen.demo.controller;

import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.dto.response.BorrowBookResponse;
import com.heulwen.demo.service.BorrowBookService;
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
public class BorrowBookController {

    BorrowBookService borrowBookService;

    @PostMapping("/books/{book_id}/borrow")
    public ApiResponse<String> borrowBook(@RequestHeader("Authorization") String authHeader, @RequestParam("book_id") Long book_id){
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
}
