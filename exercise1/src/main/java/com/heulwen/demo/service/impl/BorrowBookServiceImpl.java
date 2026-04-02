package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.response.BorrowBookResponse;
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
import com.heulwen.demo.service.TokenRedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.ParseException;
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

            boolean isAlreadyBorrowed = borrowRecordRepository.existsByUser_IdAndBook_IdAndStatus(user.getId(), bookId, BorrowStatus.BORROWED);
            if (isAlreadyBorrowed) {
                throw new AppException(ErrorCode.ALREADY_BORROWED);
            }

            book.setQuantity(book.getQuantity() - 1);
            bookRepository.save(book);

            BorrowRecord borrowRecord = BorrowRecord.builder()
                    .user(user)
                    .book(book)
                    .status(BorrowStatus.BORROWED)
                    .build();
            borrowRecordRepository.save(borrowRecord);

            emailService.sendBorrowSuccessMail(user.getEmail(), book.getTitle(), book.getImgUrl());
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
            List<BorrowRecord> records = borrowRecordRepository.findByUserIdAndStatusWithBook(user.getId(), BorrowStatus.BORROWED);

            return records.stream()
                    .map(record -> BorrowBookResponse.builder()
                            .borrowId(record.getId())
                            .bookId(record.getBook().getId())
                            .author(record.getBook().getAuthor())
                            .title(record.getBook().getTitle())
                            .imgUrl(record.getBook().getImgUrl())
                            .borrowedAt(record.getBook().getCreatedAt())
                            .build()
                    ).collect(Collectors.toList());
        } catch (ParseException e) {
            log.error("Error parsing token upon logout", e);
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }
}
