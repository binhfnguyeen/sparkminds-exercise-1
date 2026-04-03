package com.heulwen.demo.service.impl;

import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.model.User;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.MfaService;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MfaServiceImpl implements MfaService {
    GoogleAuthenticator gAuth = new GoogleAuthenticator();
    JwtService jwtService;
    UserRepository userRepository;

    @Override
    public String setupMfa(String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);
            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            if (user.isMfaEnabled()) {
                throw new AppException(ErrorCode.OTP_INVALID);
            }
            String secret = generateSecret();
            user.setMfaSecret(secret);
            userRepository.save(user);

            return secret;
        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    public String enableMfa(String token, int code) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtService.extractEmail(token);
            User user = userRepository.findUserByEmail(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            if (verifyCode(user.getMfaSecret(), code)) {
                user.setMfaEnabled(true);
                userRepository.save(user);
                return "MFA has been successfully enabled";
            }
            throw new AppException(ErrorCode.OTP_INVALID);
        } catch (ParseException e){
            throw new AppException(ErrorCode.INCORRECT_FORMAT_TOKEN);
        }
    }

    @Override
    public boolean verifyCode(String secret, int code) {
        return gAuth.authorize(secret, code);
    }

    private String generateSecret() {
        return gAuth.createCredentials().getKey();
    }
}
