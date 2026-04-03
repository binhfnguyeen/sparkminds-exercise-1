package com.heulwen.demo.specification;

import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.Role;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<User> searchMembers(String keyword, LocalDate dobFrom, LocalDate dobTo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("role"), Role.USER));
            predicates.add(cb.isFalse(root.get("deleted")));

            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword.toLowerCase().trim() + "%";
                Predicate firstNameLike = cb.like(cb.lower(root.get("firstName")), likePattern);
                Predicate lastNameLike = cb.like(cb.lower(root.get("lastName")), likePattern);
                Predicate emailLike = cb.like(cb.lower(root.get("email")), likePattern);

                predicates.add(cb.or(firstNameLike, lastNameLike, emailLike));
            }

            if (dobFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dateOfBirth"), dobFrom));
            }
            if (dobTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dateOfBirth"), dobTo));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
