package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.AuthenticateDto;
import com.heulwen.demo.form.LoginForm;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.UserStatus;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.TokenRedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;
    TokenRedisService tokenRedisService;

    @Override
    public AuthenticateDto login(LoginForm form) {
        User user = userRepository.findUserByEmail(form.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (user.getStatus() == UserStatus.BLOCKED) {
            if (user.getLockTime() != null && user.getLockTime().plusMinutes(30).isBefore(LocalDateTime.now())){
                user.setStatus(UserStatus.ACTIVE);
                user.setFailedAttempt(0);
                user.setLockTime(null);
            } else {
                throw new RuntimeException("Your account has been temporarily locked due to too many failed login attempts. Please try again in 30 minutes.");
            }
        } else if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account is not active (not verified or deleted).");
        }

        if (passwordEncoder.matches(form.getPassword(), user.getPassword())) {
            user.setFailedAttempt(user.getFailedAttempt() + 1);
            if (user.getFailedAttempt() >= 3) {
                user.setStatus(UserStatus.BLOCKED);
                user.setLockTime(LocalDateTime.now());
                log.warn("Account {} is blocked due to 3 failed login attempts.", user.getEmail());
            }
            userRepository.save(user);
            throw new RuntimeException("Invalid email or password.");
        }

        if (user.getFailedAttempt() > 0){
            user.setFailedAttempt(0);
            user.setLockTime(null);
            userRepository.save(user);
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        tokenRedisService.saveRefreshToken(user.getEmail(), refreshToken, 7);
        return new AuthenticateDto(accessToken, refreshToken);
    }
}
