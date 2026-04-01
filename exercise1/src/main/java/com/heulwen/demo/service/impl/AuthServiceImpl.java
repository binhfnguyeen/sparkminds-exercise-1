package com.heulwen.demo.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.heulwen.demo.dto.request.GoogleLoginRequest;
import com.heulwen.demo.dto.response.AuthenticateResponse;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.dto.request.ChangePasswordFirstTimeRequest;
import com.heulwen.demo.dto.request.LoginRequest;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.Role;
import com.heulwen.demo.model.enumType.UserStatus;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthServiceImpl implements AuthService {

    @Value("${google.client.id}")
    @NonFinal
    String googleClientId;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;
    TokenRedisService tokenRedisService;
    EmailService emailService;
    MfaService mfaService;

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public AuthenticateResponse login(LoginRequest form) {
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

        if (user.isMfaEnabled()) {
            return AuthenticateResponse.builder()
                    .mfaRequired(true)
                    .email(user.getEmail())
                    .build();
        }

        if (user.isRequiresPasswordChange()) {
            throw new AppException(ErrorCode.REQUIRE_PASSWORD_CHANGE);
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        long ttlDays = form.isRememberMe() ? 7 : 1;

        tokenRedisService.saveRefreshToken(user.getEmail(), refreshToken, ttlDays);
        return AuthenticateResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public AuthenticateResponse refreshToken(String refreshToken) {
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

            return AuthenticateResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    @Transactional
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
    @Transactional
    public AuthenticateResponse changePasswordFirstTime(ChangePasswordFirstTimeRequest form) {
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

        return AuthenticateResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AuthenticateResponse verifyMfaLogin(String email, int code) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isValid = mfaService.verifyCode(user.getMfaSecret(), code);
        if (!isValid) {
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        tokenRedisService.saveRefreshToken(user.getEmail(), refreshToken, 7);

        return AuthenticateResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AuthenticateResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());

            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            Boolean emailVerified = payload.getEmailVerified();
            if (!emailVerified) {
                throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
            }

            Optional<User> userOptional = userRepository.findUserByEmail(email);
            User user;

            if (userOptional.isPresent()) {
                user = userOptional.get();

                if (UserStatus.UNVERIFIED.equals(user.getStatus())) {
                    user.setStatus(UserStatus.ACTIVE);
                    userRepository.save(user);
                }
            } else {
                user = new User();
                user.setEmail(email);
                user.setFirstName((String) payload.get("given_name"));
                user.setLastName((String) payload.get("family_name"));

                String tempPassword = generateTempPassword();
                user.setPassword(passwordEncoder.encode(tempPassword));
                user.setRole(Role.USER);
                user.setStatus(UserStatus.ACTIVE);
                userRepository.save(user);
                emailService.sendNewPasswordEmail(email, tempPassword);
            }

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            long ttlDays = request.isRememberMe() ? 7 : 1;
            tokenRedisService.saveRefreshToken(user.getEmail(), refreshToken, ttlDays);
            return AuthenticateResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (Exception e) {
            throw new AppException(ErrorCode.AUTHENTICATED_FAILED);
        }
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
