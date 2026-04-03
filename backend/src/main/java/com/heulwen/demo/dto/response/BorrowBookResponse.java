package com.heulwen.demo.dto.response;

import com.heulwen.demo.model.enumType.BorrowStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BorrowBookResponse {
    Long borrowId;
    Long bookId;
    String title;
    String author;
    String imgUrl;
    BorrowStatus status;
    String userEmail;
    LocalDateTime borrowedAt;
    LocalDateTime dueDate;
    boolean isOverDue;
}
