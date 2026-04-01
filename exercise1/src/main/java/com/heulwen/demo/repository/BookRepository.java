package com.heulwen.demo.repository;

import com.heulwen.demo.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book,Long> {
    Page<Book> findAll(Specification<Book> specification, Pageable pageable);
    Page<Book> findByDeletedFalse(Pageable pageable);
    Optional<Book> findByIdAndDeletedFalse(Long id);
}
