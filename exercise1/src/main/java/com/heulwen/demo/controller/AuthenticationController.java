package com.heulwen.demo.controller;

import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.dto.response.AuthenticateResponse;
import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.dto.request.*;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.MfaService;
import com.heulwen.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationController {
    AuthService authService;
    UserService userService;
    MfaService mfaService;

    @PostMapping("/login")
    public ApiResponse<AuthenticateResponse> login(@RequestBody LoginRequest form) {
        return ApiResponse.<AuthenticateResponse>builder()
                .code(1000)
                .message("Login successful")
                .result(authService.login(form))
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody @Valid UserCreateRequest form) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Register successful")
                .result(userService.createUser(form))
                .build();
    }

    @PostMapping("/verify-email")
    public ApiResponse<String> verifyEmailOtp(@RequestBody @Valid VerifyEmailRequest form) {
        userService.verifyEmailOtp(form);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Verify email OTP successful")
                .result("Tài khoản của bạn đã được xác thực.")
                .build();
    }

    @GetMapping("/verify-email-link")
    public ApiResponse<String> verifyEmailLink(@RequestParam("token") String token) {
        String result = userService.verifyEmailLink(token);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Verify email link successful")
                .result(result)
                .build();
    }

    @PostMapping("/resend-verification")
    public ApiResponse<String> resendVerification(@RequestParam("email") String email) {
        userService.resendVerification(email);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Resend verification successful")
                .result("OTP and verification link have been resent.")
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Logout successful")
                .build();
    }

    @PostMapping("/refresh-token")
    public ApiResponse<AuthenticateResponse> refreshToken(@RequestHeader("Authorization") String authHeader) {
        return ApiResponse.<AuthenticateResponse>builder()
                .code(1000)
                .message("Refresh token successful")
                .result(authService.refreshToken(authHeader))
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("A temporary password has been sent via email.")
                .build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<AuthenticateResponse> resetPassword(@RequestBody ChangePasswordFirstTimeRequest form){
        return ApiResponse.<AuthenticateResponse>builder()
                .code(1000)
                .message("Reset password successful")
                .result(authService.changePasswordFirstTime(form))
                .build();
    }

    @PostMapping("/change-password")
    public ApiResponse<UserResponse> changePassword(@RequestHeader("Authorization") String authHeader, @RequestBody ChangePasswordRequest form){
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Change password successful")
                .result(userService.changePassword(authHeader, form))
                .build();
    }

    @PostMapping("/change-phone")
    public ApiResponse<UserResponse> changePhone(@RequestHeader("Authorization") String authHeader, @RequestBody @Valid ChangePhoneRequest form){
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Change phone successful")
                .result(userService.changePhone(authHeader, form))
                .build();
    }

    @PostMapping("/send-otp-change-mail")
    public ApiResponse<String> sendOtpChangeMail(@RequestHeader("Authorization") String authHeader){
        userService.sendMailOtp(authHeader);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Send OTP successful")
                .build();
    }

    @PostMapping("/change-mail")
    public ApiResponse<UserResponse> changeMail(@RequestHeader("Authorization") String authHeader, @RequestBody @Valid ChangeMailRequest form){
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Change email successful")
                .result(userService.changeMail(authHeader, form))
                .build();
    }

    @PostMapping("/mfa/setup")
    public ApiResponse<String> setupMfa(@RequestHeader("Authorization") String authHeader) {
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Scan this code using Google Authenticator.")
                .result(mfaService.setupMfa(authHeader))
                .build();
    }

    @PostMapping("/mfa/enable")
    public ApiResponse<String> enableMfa(@RequestHeader("Authorization") String authHeader, @RequestParam int code) {
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Enable MFA successful")
                .result(mfaService.enableMfa(authHeader, code))
                .build();
    }

    @PostMapping("/login/mfa-verify")
    public ApiResponse<AuthenticateResponse> verifyMfaLogin(@RequestParam String email, @RequestParam int code){
        return ApiResponse.<AuthenticateResponse>builder()
                .code(1000)
                .message("MFA Verification successful")
                .result(authService.verifyMfaLogin(email, code))
                .build();
    }

    @GetMapping("/profile")
    public ApiResponse<UserResponse> getProfile(@RequestHeader("Authorization") String authHeader) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Get profile successful")
                .result(userService.getProfile(authHeader))
                .build();
    }

    @PostMapping("/login/google")
    public ApiResponse<AuthenticateResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request){
        return ApiResponse.<AuthenticateResponse>builder()
                .code(1000)
                .message("Google Login successful")
                .result(authService.loginWithGoogle(request))
                .build();
    }
}
