package com.heulwen.demo.service;

import com.heulwen.demo.dto.AuthenticateDto;
import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.form.ChangePasswordFirstTimeForm;
import com.heulwen.demo.form.LoginForm;

public interface AuthService {
    AuthenticateDto login(LoginForm form);
    void logout(String accessToken);
    AuthenticateDto refreshToken(String refreshToken);
    void forgotPassword(String email);
    AuthenticateDto changePasswordFirstTime(ChangePasswordFirstTimeForm form);
}
