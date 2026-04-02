package com.heulwen.demo.repository;

import com.heulwen.demo.model.BorrowRecord;
import com.heulwen.demo.model.enumType.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    boolean existsByUser_IdAndBook_IdAndStatus(Long userId, Long bookId, BorrowStatus status);

    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book WHERE br.user.id = :userId AND br.status = :status")
    List<BorrowRecord> findByUserIdAndStatusWithBook(@Param("userId") Long userId, @Param("status") BorrowStatus status);
}
