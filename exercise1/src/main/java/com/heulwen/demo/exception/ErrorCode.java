package com.heulwen.demo.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    INVALID_EMAIL(1006, "Invalid email", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1007, "Invalid password", HttpStatus.BAD_REQUEST),
    ACCOUNT_UNVERIFIED(1008, "Account unverified", HttpStatus.UNAUTHORIZED),
    ACCOUNT_LOCKED(1009, "Account locked. Try again after 30 minutes", HttpStatus.LOCKED),
    ACCOUNT_VERIFIED(10010, "The account has already been verified.", HttpStatus.BAD_REQUEST),
    OTP_USED(10011, "This OTP has already been used.", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(10012, "This OTP has expired.", HttpStatus.BAD_REQUEST),
    TEMPORARY_BLOCKED(10013, "This temporary blocked user.", HttpStatus.BAD_REQUEST),
    USER_EXISTED(10014, "The user already existed.", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_INVALID(10015, "Refresh token is invalid.", HttpStatus.BAD_REQUEST),
    INCORRECT_FORMAT_TOKEN(10016, "Incorrect format token.", HttpStatus.BAD_REQUEST),
    REQUIRE_PASSWORD_CHANGE(1017, "You must change your password before logging in.", HttpStatus.FORBIDDEN),
    NO_PASSWORD_CHANGE_REQUIRED(1018, "This account does not require a mandatory password change.", HttpStatus.FORBIDDEN),
    SAME_PHONE(1019, "The old and new phone numbers are the same.", HttpStatus.BAD_REQUEST),
    SAME_EMAIL(1020, "The old and new emails are the same.", HttpStatus.BAD_REQUEST),
    OTP_INVALID(1021, "Invalid OTP.", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1022, "The phone already existed.", HttpStatus.BAD_REQUEST),
    AUTHENTICATED_FAILED(1023, "Authentication failed.", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(1024, "Invalid token.", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_VERIFIED(1025, "Email not verified.", HttpStatus.BAD_REQUEST),
    EMPTY_FILE(1026, "File is empty.", HttpStatus.BAD_REQUEST),
    INVALID_FILE_FORMAT(1027, "Invalid file format.", HttpStatus.BAD_REQUEST),
    UPLOAD_FAILED(1028, "Upload failed.", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED(1030, "Category already existed.", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_EXISTED(1031, "Category not existed.", HttpStatus.BAD_REQUEST),
    INVALID_DATE_FORMAT(1032, "Invalid date format.", HttpStatus.BAD_REQUEST),
    INVALID_DATE_RANGE(1033, "Invalid date range", HttpStatus.BAD_REQUEST),
    FILE_EMPTY(1034, "File is empty.", HttpStatus.BAD_REQUEST),
    BOOK_NOT_EXISTED(1035, "Book not existed.", HttpStatus.BAD_REQUEST),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
