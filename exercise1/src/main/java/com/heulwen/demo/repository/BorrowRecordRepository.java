package com.heulwen.demo.repository;

import com.heulwen.demo.model.BorrowRecord;
import com.heulwen.demo.model.enumType.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long>, JpaSpecificationExecutor<BorrowRecord> {

    boolean existsByUser_IdAndBook_IdAndStatusIn(Long userId, Long bookId, List<BorrowStatus> statuses);

    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book WHERE br.user.id = :userId")
    List<BorrowRecord> findByUserIdAndStatusWithBook(@Param("userId") Long userIds);

    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book JOIN FETCH br.user ORDER BY br.createdAt DESC")
    List<BorrowRecord> findAllWithBookAndUser();
}
