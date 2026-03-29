package com.heulwen.demo.repository;

import com.heulwen.demo.model.User;
import com.heulwen.demo.model.VerificationToken;
import com.heulwen.demo.model.enumType.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByTokenAndUserAndType(String token, User user, VerificationType type);

    Optional<VerificationToken> findByTokenAndType(String token, VerificationType type);

    List<VerificationToken> findByUserAndTypeInAndUsedFalse(User user, List<VerificationType> types);
}
