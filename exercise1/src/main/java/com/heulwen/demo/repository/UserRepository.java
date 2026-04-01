package com.heulwen.demo.repository;

import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByEmail(String email);
    
    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<User> findByIdAndRoleAndDeletedFalse(Long id, Role role);

    Page<User> findAll(Specification<User> specification, Pageable pageable);
}
