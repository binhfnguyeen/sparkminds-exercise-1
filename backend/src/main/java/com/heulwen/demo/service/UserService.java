package com.heulwen.demo.service;

import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.dto.request.*;

public interface UserService {
    UserResponse createUser(UserCreateRequest form);
    String verifyEmailOtp(VerifyEmailRequest form);
    String verifyEmailLink(String token);
    void resendVerification(String email);
    UserResponse changePassword(String email, ChangePasswordRequest form);
    UserResponse changePhone(String token, ChangePhoneRequest form);
    void sendMailOtp(String token);
    UserResponse changeMail(String token, ChangeMailRequest form);
    UserResponse getProfile(String token);
}
