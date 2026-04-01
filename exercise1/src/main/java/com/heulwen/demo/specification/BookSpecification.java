package com.heulwen.demo.specification;

import com.heulwen.demo.model.Book;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BookSpecification {

    public static Specification<Book> searchBooks(String keyword, LocalDateTime fromTime, LocalDateTime toTime){
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isFalse(root.get("deleted")));

            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword.toLowerCase().trim() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), likePattern);
                Predicate authorLike = cb.like(cb.lower(root.get("author")), likePattern);
                predicates.add(cb.or(titleLike, authorLike));
            }

            if (fromTime != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), fromTime));
            }

            if (toTime != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), toTime));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
