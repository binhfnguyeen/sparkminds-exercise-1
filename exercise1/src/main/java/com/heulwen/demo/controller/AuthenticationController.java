package com.heulwen.demo.controller;

import com.heulwen.demo.dto.ApiDto;
import com.heulwen.demo.dto.AuthenticateDto;
import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.form.*;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.JwtService;
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
    public ApiDto<AuthenticateDto> login(@RequestBody LoginForm form) {
        return ApiDto.<AuthenticateDto>builder()
                .code(1000)
                .message("Login successful")
                .result(authService.login(form))
                .build();
    }

    @PostMapping("/register")
    public  ApiDto<UserDto> register(@RequestBody @Valid UserCreateForm form) {
        return ApiDto.<UserDto>builder()
                .code(1000)
                .message("Register successful")
                .result(userService.createUser(form))
                .build();
    }

    @PostMapping("/verify-email")
    public ApiDto<String> verifyEmailOtp(@RequestBody @Valid VerifyEmailForm form) {
        userService.verifyEmailOtp(form);
        return ApiDto.<String>builder()
                .code(1000)
                .message("Verify email OTP successful")
                .result("Tài khoản của bạn đã được xác thực.")
                .build();
    }

    @GetMapping("/verify-email-link")
    public ApiDto<String> verifyEmailLink(@RequestParam("token") String token) {
        String result = userService.verifyEmailLink(token);
        return ApiDto.<String>builder()
                .code(1000)
                .message("Verify email link successful")
                .result(result)
                .build();
    }

    @PostMapping("/resend-verification")
    public ApiDto<String> resendVerification(@RequestParam("email") String email) {
        userService.resendVerification(email);
        return ApiDto.<String>builder()
                .code(1000)
                .message("Resend verification successful")
                .result("OTP and verification link have been resent.")
                .build();
    }

    @PostMapping("/logout")
    public ApiDto<String> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ApiDto.<String>builder()
                .code(1000)
                .message("Logout successful")
                .build();
    }

    @PostMapping("/refresh-token")
    public ApiDto<AuthenticateDto> refreshToken(@RequestHeader("Authorization") String authHeader) {
        return ApiDto.<AuthenticateDto>builder()
                .code(1000)
                .message("Refresh token successful")
                .result(authService.refreshToken(authHeader))
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiDto<String> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ApiDto.<String>builder()
                .code(1000)
                .message("A temporary password has been sent via email.")
                .build();
    }

    @PostMapping("/reset-password")
    public ApiDto<AuthenticateDto> resetPassword(@RequestBody ChangePasswordFirstTimeForm form){
        return ApiDto.<AuthenticateDto>builder()
                .code(1000)
                .message("Reset password successful")
                .result(authService.changePasswordFirstTime(form))
                .build();
    }

    @PostMapping("/change-password")
    public ApiDto<UserDto> changePassword(@RequestHeader("Authorization") String authHeader, @RequestBody ChangePasswordForm form){
        return ApiDto.<UserDto>builder()
                .code(1000)
                .message("Change password successful")
                .result(userService.changePassword(authHeader, form))
                .build();
    }

    @PostMapping("/change-phone")
    public ApiDto<UserDto> changePhone(@RequestHeader("Authorization") String authHeader, @RequestBody @Valid ChangePhoneForm form){
        return ApiDto.<UserDto>builder()
                .code(1000)
                .message("Change phone successful")
                .result(userService.changePhone(authHeader, form))
                .build();
    }

    @PostMapping("/send-otp-change-mail")
    public ApiDto<String> sendOtpChangeMail(@RequestHeader("Authorization") String authHeader){
        userService.sendMailOtp(authHeader);
        return ApiDto.<String>builder()
                .code(1000)
                .message("Send OTP successful")
                .build();
    }

    @PostMapping("/change-mail")
    public ApiDto<UserDto> changeMail(@RequestHeader("Authorization") String authHeader, @RequestBody @Valid ChangeMailForm form){
        return ApiDto.<UserDto>builder()
                .code(1000)
                .message("Change email successful")
                .result(userService.changeMail(authHeader, form))
                .build();
    }

    @PostMapping("/mfa/setup")
    public ApiDto<String> setupMfa(@RequestHeader("Authorization") String authHeader) {
        return ApiDto.<String>builder()
                .code(1000)
                .message("Scan this code using Google Authenticator.")
                .result(mfaService.setupMfa(authHeader))
                .build();
    }

    @PostMapping("/mfa/enable")
    public ApiDto<String> enableMfa(@RequestHeader("Authorization") String authHeader, @RequestParam int code) {
        return ApiDto.<String>builder()
                .code(1000)
                .message("Enable MFA successful")
                .result(mfaService.enableMfa(authHeader, code))
                .build();
    }

    @PostMapping("/login/mfa-verify")
    public ApiDto<AuthenticateDto> verifyMfaLogin(@RequestParam String email, @RequestParam int code){
        return ApiDto.<AuthenticateDto>builder()
                .code(1000)
                .message("MFA Verification successful")
                .result(authService.verifyMfaLogin(email, code))
                .build();
    }
}
