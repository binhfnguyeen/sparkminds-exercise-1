package com.heulwen.demo.repository;

import com.heulwen.demo.model.User;
import com.heulwen.demo.model.VerificationToken;
import com.heulwen.demo.model.enumType.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByTokenAndUserAndType(String token, User user, VerificationType type);
}
