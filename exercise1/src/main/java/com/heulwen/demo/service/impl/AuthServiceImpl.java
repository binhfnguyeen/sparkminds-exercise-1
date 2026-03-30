package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.AuthenticateDto;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.form.ChangePasswordFirstTimeForm;
import com.heulwen.demo.form.LoginForm;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.UserStatus;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.EmailService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.TokenRedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.ParseException;
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
    EmailService emailService;

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public AuthenticateDto login(LoginForm form) {
        User user = userRepository.findUserByEmail(form.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMAIL));

        if (user.getStatus() == UserStatus.BLOCKED) {
            if (user.getLockTime() != null && user.getLockTime().plusMinutes(30).isBefore(LocalDateTime.now())){
                user.setStatus(UserStatus.ACTIVE);
                user.setFailedAttempt(0);
                user.setLockTime(null);
            } else {
                throw new AppException(ErrorCode.TEMPORARY_BLOCKED);
            }
        } else if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ErrorCode.ACCOUNT_UNVERIFIED);
        }

        if (!passwordEncoder.matches(form.getPassword(), user.getPassword())) {
            user.setFailedAttempt(user.getFailedAttempt() + 1);
            if (user.getFailedAttempt() >= 3) {
                user.setStatus(UserStatus.BLOCKED);
                user.setLockTime(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                log.warn("Account {} is blocked due to 3 failed login attempts.", user.getEmail());
            }
            userRepository.save(user);
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        if (user.getFailedAttempt() > 0){
            user.setFailedAttempt(0);
            user.setLockTime(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        if (user.isRequiresPasswordChange()) {
            throw new AppException(ErrorCode.REQUIRE_PASSWORD_CHANGE);
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        tokenRedisService.saveRefreshToken(user.getEmail(), refreshToken, 7);
        return AuthenticateDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public void logout(String accessToken) {
        try {
            if (accessToken != null && accessToken.startsWith("Bearer ")) {
                accessToken = accessToken.substring(7);
            }

            String email = jwtService.extractEmail(accessToken);
            long remainingTime = jwtService.getRemainingTimeInSeconds(accessToken);

            if (remainingTime > 0) {
                tokenRedisService.blacklistAccessToken(accessToken, remainingTime);
            }

            tokenRedisService.deleteRefreshToken(email);
        } catch (ParseException e) {
            log.error("Error parsing token upon logout", e);
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    public AuthenticateDto refreshToken(String refreshToken) {
        try {
            if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
                refreshToken = refreshToken.substring(7);
            }

            String email = jwtService.extractEmail(refreshToken);
            String storedRefreshToken = tokenRedisService.getRefreshToken(email);
            if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
                throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
            }

            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            String newAccessToken = jwtService.generateAccessToken(user);

            return AuthenticateDto.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String tempPassword = generateTempPassword();

        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRequiresPasswordChange(true);
        userRepository.save(user);

        emailService.sendNewPasswordEmail(email, tempPassword);
        log.info("A temporary password has been issued for user: {}", email);
    }

    @Override
    public AuthenticateDto changePasswordFirstTime(ChangePasswordFirstTimeForm form) {
        User user = userRepository.findUserByEmail(form.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!user.isRequiresPasswordChange()){
            throw new AppException(ErrorCode.NO_PASSWORD_CHANGE_REQUIRED);
        }

        if (!passwordEncoder.matches(form.getTempPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(form.getNewPassword()));
        user.setRequiresPasswordChange(false);
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        tokenRedisService.saveRefreshToken(user.getEmail(), refreshToken, 7);

        return AuthenticateDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    private String generateTempPassword(){
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        sb.append("1aA");
        return sb.toString();
    }
}
