package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.form.UserCreateForm;
import com.heulwen.demo.form.VerifyEmailForm;
import com.heulwen.demo.mapper.UserMapper;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.VerificationToken;
import com.heulwen.demo.model.enumType.UserStatus;
import com.heulwen.demo.model.enumType.VerificationType;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.repository.VerificationTokenRepository;
import com.heulwen.demo.service.EmailService;
import com.heulwen.demo.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    VerificationTokenRepository  verificationTokenRepository;
    PasswordEncoder passwordEncoder;
    EmailService emailService;

    @Override
    @Transactional
    public UserDto createUser(UserCreateForm form) {
        if (userRepository.existsByEmail(form.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = UserMapper.map(form);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        SecureRandom random = new SecureRandom();
        int otpNumber = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpNumber);

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(otp);
        verificationToken.setType(VerificationType.EMAIL_VERIFICATION);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        verificationToken.setUsed(false);
        verificationToken.setUser(savedUser);
        verificationTokenRepository.save(verificationToken);

        emailService.sendOtpEmail(savedUser.getEmail(), otp);

        log.info("User account created successfully. Verification OTP sent to: {}", savedUser.getEmail());

        return UserMapper.map(userRepository.save(user));
    }

    @Override
    public UserDto verifyEmailOtp(VerifyEmailForm form) {
        User user = userRepository.findUserByEmail(form.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_VERIFIED);
        }

        VerificationToken verificationToken = verificationTokenRepository
                .findByTokenAndUserAndType(form.getOtp(), user, VerificationType.EMAIL_VERIFICATION);

        if (verificationToken.isUsed()){
            throw new AppException(ErrorCode.ACCOUNT_VERIFIED);
        }

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())){
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);

        user.setStatus(UserStatus.ACTIVE);
        return UserMapper.map(userRepository.save(user));
    }
}
