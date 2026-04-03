package com.heulwen.demo.model.enumType;

public enum VerificationType {
    EMAIL_VERIFICATION_OTP, // Dùng cho đăng ký mới OTP
    EMAIL_VERIFICATION_LINK, // Dùng cho đăng ký mới LINK
    RESET_PASSWORD,     // Dùng cho quên mật khẩu
    CHANGE_EMAIL_OTP,        // Dùng cho đổi email mới
    CHANGE_EMAIL_LINK,
}
