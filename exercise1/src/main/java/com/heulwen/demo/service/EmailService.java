package com.heulwen.demo.service;

public interface EmailService {
    void sendOtpEmail(String to, String otp, String link);
    void sendNewPasswordEmail(String to, String newPassword);
    void sendOtpChangeMail(String to, String otp);
    void sendBorrowSuccessMail(String to, String bookTitle, String coverImgUrl);
}
