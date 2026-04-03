package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.response.BorrowBookResponse;
import com.heulwen.demo.dto.response.PageResponse;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.model.Book;
import com.heulwen.demo.model.BorrowRecord;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.BorrowStatus;
import com.heulwen.demo.repository.BookRepository;
import com.heulwen.demo.repository.BorrowRecordRepository;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.BorrowBookService;
import com.heulwen.demo.service.EmailService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.specification.BorrowRecordSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BorrowBookServiceImpl implements BorrowBookService {

    BookRepository bookRepository;
    UserRepository userRepository;
    BorrowRecordRepository borrowRecordRepository;
    JwtService jwtService;
    EmailService emailService;

    @Override
    public void borrowBook(String token, Long bookId) {
        try{
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);

            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_EXISTED));

            if (book.getQuantity() <= 0) {
                throw new AppException(ErrorCode.OUT_OF_STOCK);
            }

            boolean isAlreadyBorrowed = borrowRecordRepository.existsByUser_IdAndBook_IdAndStatusIn(
                    user.getId(), bookId, List.of(BorrowStatus.BORROWED, BorrowStatus.PENDING)
            );
            if (isAlreadyBorrowed) {
                throw new AppException(ErrorCode.ALREADY_BORROWED);
            }

            BorrowRecord borrowRecord = BorrowRecord.builder()
                    .user(user)
                    .book(book)
                    .status(BorrowStatus.PENDING)
                    .build();
            borrowRecordRepository.save(borrowRecord);
        } catch (ParseException e) {
            log.error("Error parsing token upon logout", e);
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    public List<BorrowBookResponse> getBorrowedBooks(String token) {
        try{
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);
            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            List<BorrowRecord> records = borrowRecordRepository.findByUserIdAndStatusWithBook(user.getId());

            return records.stream()
                    .map(record -> BorrowBookResponse.builder()
                            .borrowId(record.getId())
                            .bookId(record.getBook().getId())
                            .author(record.getBook().getAuthor())
                            .title(record.getBook().getTitle())
                            .imgUrl(record.getBook().getImgUrl())
                            .status(record.getStatus())
                            .userEmail(record.getUser().getEmail())
                            .borrowedAt(record.getCreatedAt())
                            .dueDate(record.getDueDate())
                            .isOverDue(record.getDueDate() != null && LocalDateTime.now().isAfter(record.getDueDate()))
                            .build()
                    ).collect(Collectors.toList());
        } catch (ParseException e) {
            log.error("Error parsing token upon logout", e);
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    public void approveBorrowRequest(Long borrowId) {
        BorrowRecord record = borrowRecordRepository
                .findById(borrowId).orElseThrow(() -> new AppException(ErrorCode.RECORD_NOT_EXISTED));

        if (!BorrowStatus.PENDING.equals(record.getStatus())) {
            throw new AppException(ErrorCode.RECORD_INVALID_STATUS);
        }

        Book book = record.getBook();

        if (book.getQuantity() <= 0) {
            record.setStatus(BorrowStatus.REJECTED);
            borrowRecordRepository.save(record);
            throw new AppException(ErrorCode.OUT_OF_STOCK);
        }

        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);

        record.setStatus(BorrowStatus.BORROWED);
        record.setDueDate(LocalDateTime.now().plusDays(14));
        borrowRecordRepository.save(record);

        emailService.sendBorrowSuccessMail(record.getUser().getEmail(), book.getTitle(), book.getImgUrl());
    }

    @Override
    public void rejectBorrowRequest(Long borrowId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowId)
                .orElseThrow(() -> new AppException(ErrorCode.RECORD_NOT_EXISTED));

        if (!BorrowStatus.PENDING.equals(record.getStatus())) {
            throw new AppException(ErrorCode.RECORD_INVALID_STATUS);
        }

        record.setStatus(BorrowStatus.REJECTED);
        borrowRecordRepository.save(record);
    }

    @Override
    public List<BorrowBookResponse> getAllBookRequestsForAdmin() {
        List<BorrowRecord> records = borrowRecordRepository.findAllWithBookAndUser();
        return records.stream().map(
                record -> BorrowBookResponse.builder()
                        .borrowId(record.getId())
                        .bookId(record.getBook().getId())
                        .title(record.getBook().getTitle())
                        .author(record.getBook().getAuthor())
                        .imgUrl(record.getBook().getImgUrl())
                        .status(record.getStatus())
                        .borrowedAt(record.getCreatedAt())
                        .dueDate(record.getDueDate())
                        .isOverDue(record.getDueDate() != null && LocalDateTime.now().isAfter(record.getDueDate()))
                        .userEmail(record.getUser().getEmail())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    public void returnBook(Long borrowId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowId)
                .orElseThrow(()->new AppException(ErrorCode.RECORD_NOT_EXISTED));

        if (!BorrowStatus.BORROWED.equals(record.getStatus())) {
            throw new AppException(ErrorCode.RECORD_INVALID_STATUS);
        }

        record.setStatus(BorrowStatus.RETURNED);
        record.setReturnedAt(LocalDateTime.now());
        borrowRecordRepository.save(record);

        Book book = record.getBook();
        book.setQuantity(book.getQuantity() + 1);
        bookRepository.save(book);
    }

    @Override
    public PageResponse<BorrowBookResponse> searchBorrowRecordsAdmin(String email, String title, BorrowStatus status, LocalDateTime fromDate, LocalDateTime toDate, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<BorrowRecord> spec = Specification.where(BorrowRecordSpecification.hasUserEmail(email))
                .and(BorrowRecordSpecification.hasBookTitle(title))
                .and(BorrowRecordSpecification.hasStatus(status))
                .and(BorrowRecordSpecification.borrowedAfter(fromDate))
                .and(BorrowRecordSpecification.borrowedBefore(toDate));

        Page<BorrowRecord> recordPage = borrowRecordRepository.findAll(spec, pageable);

        List<BorrowBookResponse> content = recordPage.getContent().stream().map(record -> BorrowBookResponse.builder()
                .borrowId(record.getId())
                .bookId(record.getBook().getId())
                .title(record.getBook().getTitle())
                .author(record.getBook().getAuthor())
                .imgUrl(record.getBook().getImgUrl())
                .status(record.getStatus())
                .borrowedAt(record.getCreatedAt())
                .dueDate(record.getDueDate())
                .isOverDue(record.getDueDate() != null && LocalDateTime.now().isAfter(record.getDueDate()))
                .userEmail(record.getUser().getEmail())
                .build()).collect(Collectors.toList());

        return PageResponse.<BorrowBookResponse>builder()
                .currentPage(page)
                .totalPages(recordPage.getTotalPages())
                .pageSize(recordPage.getSize())
                .totalElements(recordPage.getTotalElements())
                .content(content)
                .build();
    }
}
