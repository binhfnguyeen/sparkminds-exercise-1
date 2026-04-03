package com.heulwen.demo.specification;

import com.heulwen.demo.model.BorrowRecord;
import com.heulwen.demo.model.enumType.BorrowStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class BorrowRecordSpecification {
    public static Specification<BorrowRecord> hasUserEmail(String email) {
        return (root, query, cb) -> email == null || email.isEmpty() ? null :
                cb.like(cb.lower(root.get("user").get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<BorrowRecord> hasBookTitle(String title) {
        return (root, query, cb) -> title == null || title.isEmpty() ? null :
                cb.like(cb.lower(root.get("book").get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<BorrowRecord> hasStatus(BorrowStatus status) {
        return (root, query, cb) -> status == null ? null :
                cb.equal(root.get("status"), status);
    }

    public static Specification<BorrowRecord> borrowedAfter(LocalDateTime fromDate) {
        return (root, query, cb) -> fromDate == null ? null :
                cb.greaterThanOrEqualTo(root.get("createdAt"), fromDate);
    }

    public static Specification<BorrowRecord> borrowedBefore(LocalDateTime toDate) {
        return (root, query, cb) -> toDate == null ? null :
                cb.lessThanOrEqualTo(root.get("createdAt"), toDate);
    }
}
