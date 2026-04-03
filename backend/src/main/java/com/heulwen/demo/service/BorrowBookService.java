package com.heulwen.demo.service;

import com.heulwen.demo.dto.response.BorrowBookResponse;
import com.heulwen.demo.dto.response.PageResponse;
import com.heulwen.demo.model.enumType.BorrowStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface BorrowBookService {
    void borrowBook(String token, Long bookId);
    List<BorrowBookResponse> getBorrowedBooks(String token);
    void approveBorrowRequest(Long borrowId);
    void rejectBorrowRequest(Long borrowId);
    List<BorrowBookResponse> getAllBookRequestsForAdmin();
    void returnBook(Long borrowId);
    PageResponse<BorrowBookResponse> searchBorrowRecordsAdmin(String email, String title, BorrowStatus status, LocalDateTime fromDate, LocalDateTime toDate, int page, int size, String sortBy, String sortDir);
}
