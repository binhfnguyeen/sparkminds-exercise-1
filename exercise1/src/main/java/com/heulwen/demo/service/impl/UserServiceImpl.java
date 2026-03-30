package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.form.ChangeMailForm;
import com.heulwen.demo.form.ChangePasswordForm;
import com.heulwen.demo.form.ChangePhoneForm;
import com.heulwen.demo.form.UserCreateForm;
import com.heulwen.demo.mapper.UserMapper;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.VerificationToken;
import com.heulwen.demo.model.enumType.UserStatus;
import com.heulwen.demo.model.enumType.VerificationType;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.repository.VerificationTokenRepository;
import com.heulwen.demo.service.EmailService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.TokenRedisService;
import com.heulwen.demo.service.UserService;
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
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    VerificationTokenRepository verificationTokenRepository;
    PasswordEncoder passwordEncoder;
    EmailService emailService;
    JwtService jwtService;
    private final TokenRedisService tokenRedisService;

    @Override
    @Transactional
    public UserDto createUser(UserCreateForm form) {
        if (userRepository.existsByEmail(form.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if (userRepository.existsByPhone(form.getPhone())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        User user = UserMapper.map(form);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        sendVerification(savedUser, VerificationType.EMAIL_VERIFICATION_OTP, VerificationType.EMAIL_VERIFICATION_LINK);

        log.info("User account created successfully. Verification OTP sent to: {}", savedUser.getEmail());

        return UserMapper.map(savedUser);
    }

    @Override
    @Transactional
    public String verifyEmailLink(String token) {
        VerificationToken verificationToken = verificationTokenRepository
                .findByTokenAndType(token, VerificationType.EMAIL_VERIFICATION_LINK)
                .orElseThrow(() -> new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN));

        if (verificationToken.isUsed()) {
            throw new AppException(ErrorCode.OTP_USED);
        }

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

        User user = verificationToken.getUser();
        if (UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_VERIFIED);
        }

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        return "Account verification successful!";
    }

    @Override
    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));

        if (UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_VERIFIED);
        }

        List<VerificationToken> oldTokens = verificationTokenRepository
                .findByUserAndTypeInAndUsedFalse(user,
                        List.of(VerificationType.EMAIL_VERIFICATION_OTP,
                                VerificationType.EMAIL_VERIFICATION_LINK));

        oldTokens.forEach(t -> t.setExpiryDate(LocalDateTime.now()));
        verificationTokenRepository.saveAll(oldTokens);

        sendVerification(user, VerificationType.EMAIL_VERIFICATION_OTP, VerificationType.EMAIL_VERIFICATION_LINK);
    }

    @Override
    @Transactional
    public UserDto changePassword(String token, ChangePasswordForm form) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);

            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(()->new AppException(ErrorCode.USER_NOT_EXISTED));

            tokenRedisService.deleteRefreshToken(email);
            if (!passwordEncoder.matches(form.getOldPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.INVALID_PASSWORD);
            }

            user.setPassword(passwordEncoder.encode(form.getNewPassword()));

            return UserMapper.map(userRepository.save(user));
        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    @Transactional
    public UserDto changePhone(String token, ChangePhoneForm form) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);
            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            if (form.getPhone().equals(user.getPhone())) {
                throw new AppException(ErrorCode.SAME_PHONE);
            }

            user.setPhone(form.getPhone());
            return UserMapper.map(userRepository.save(user));
        } catch (ParseException e) {
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void sendMailOtp(String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);
            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            sendVerification(user, VerificationType.CHANGE_EMAIL_OTP);

        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    @Transactional
    public UserDto changeMail(String token, ChangeMailForm form) {
        try {
            String actualToken = token;
            if (actualToken != null && actualToken.startsWith("Bearer ")) {
                actualToken = actualToken.substring(7);
            }

            String currentEmail = jwtService.extractEmail(actualToken);
            User user = userRepository.findUserByEmail(currentEmail)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            if (currentEmail.equals(form.getNewEmail())){
                throw new AppException(ErrorCode.SAME_EMAIL);
            }

            if (userRepository.existsByEmail(form.getNewEmail())) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            VerificationToken verificationToken = verificationTokenRepository
                    .findByTokenAndUserAndType(form.getOtp(), user, VerificationType.CHANGE_EMAIL_OTP)
                    .orElseThrow(() -> new AppException(ErrorCode.OTP_INVALID));

            if (verificationToken.isUsed()){
                throw new AppException(ErrorCode.OTP_USED);
            }

            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new AppException(ErrorCode.OTP_EXPIRED);
            }

            verificationToken.setUsed(true);
            verificationTokenRepository.save(verificationToken);

            user.setEmail(form.getNewEmail());
            User updatedUser = userRepository.save(user);

            tokenRedisService.deleteRefreshToken(currentEmail);

            long remainingTime = jwtService.getRemainingTimeInSeconds(actualToken);
            if (remainingTime > 0){
                tokenRedisService.blacklistAccessToken(actualToken, remainingTime);
            }

            return UserMapper.map(updatedUser);
        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    private void sendVerification(User user, VerificationType otpType, VerificationType linkType) {
        String otp = String.valueOf(100000 + new SecureRandom().nextInt(900000));
        String linkToken = UUID.randomUUID().toString();

        VerificationToken otpEntity = new VerificationToken();
        otpEntity.setToken(otp);
        otpEntity.setType(otpType);
        otpEntity.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);
        otpEntity.setUser(user);

        VerificationToken linkEntity = new VerificationToken();
        linkEntity.setToken(linkToken);
        linkEntity.setType(linkType);
        linkEntity.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        linkEntity.setUsed(false);
        linkEntity.setUser(user);

        verificationTokenRepository.saveAll(List.of(otpEntity, linkEntity));

        String verifyLink = "http://localhost:8081/api/verify-email-link?token=" + linkToken;

        emailService.sendOtpEmail(user.getEmail(), otp, verifyLink);
    }

    private void sendVerification(User user, VerificationType otpType){
        String otp = String.valueOf(100000 + new SecureRandom().nextInt(900000));

        VerificationToken otpEntity = new VerificationToken();
        otpEntity.setToken(otp);
        otpEntity.setType(otpType);
        otpEntity.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);
        otpEntity.setUser(user);

        verificationTokenRepository.save(otpEntity);
        emailService.sendOtpChangeMail(user.getEmail(), otp);
    }
}
