package com.heulwen.demo.controller;

import com.heulwen.demo.dto.ApiDto;
import com.heulwen.demo.dto.AuthenticateDto;
import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.form.ChangePasswordFirstTimeForm;
import com.heulwen.demo.form.ChangePasswordForm;
import com.heulwen.demo.form.LoginForm;
import com.heulwen.demo.form.UserCreateForm;
import com.heulwen.demo.service.AuthService;
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

    @PostMapping("/verify-email-link")
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
}
