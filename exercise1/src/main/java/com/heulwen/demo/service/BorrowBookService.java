package com.heulwen.demo.service;

import com.heulwen.demo.dto.response.BorrowBookResponse;

import java.util.List;

public interface BorrowBookService {
    void borrowBook(String token, Long bookId);
    List<BorrowBookResponse> getBorrowedBooks(String token);
    void approveBorrowRequest(Long borrowId);
    void rejectBorrowRequest(Long borrowId);
    List<BorrowBookResponse> getAllBookRequestsForAdmin();
}
