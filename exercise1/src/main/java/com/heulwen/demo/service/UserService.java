package com.heulwen.demo.service;

import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.form.*;

public interface UserService {
    UserDto createUser(UserCreateForm form);
    String verifyEmailOtp(VerifyEmailForm form);
    String verifyEmailLink(String token);
    void resendVerification(String email);
    UserDto changePassword(String email, ChangePasswordForm form);
    UserDto changePhone(String token, ChangePhoneForm form);
    void sendMailOtp(String token);
    UserDto changeMail(String token, ChangeMailForm form);
}
