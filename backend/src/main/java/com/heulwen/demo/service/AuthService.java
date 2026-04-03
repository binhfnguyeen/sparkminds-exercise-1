package com.heulwen.demo.service;

import com.heulwen.demo.dto.request.GoogleLoginRequest;
import com.heulwen.demo.dto.response.AuthenticateResponse;
import com.heulwen.demo.dto.request.ChangePasswordFirstTimeRequest;
import com.heulwen.demo.dto.request.LoginRequest;

public interface AuthService {
    AuthenticateResponse login(LoginRequest form);
    void logout(String accessToken);
    AuthenticateResponse refreshToken(String refreshToken);
    void forgotPassword(String email);
    AuthenticateResponse changePasswordFirstTime(ChangePasswordFirstTimeRequest form);
    AuthenticateResponse verifyMfaLogin(String email, int code);
    AuthenticateResponse loginWithGoogle(GoogleLoginRequest request);
}
