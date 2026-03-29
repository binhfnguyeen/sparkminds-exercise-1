package com.heulwen.demo.service.impl;

import com.heulwen.demo.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
    JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String to, String otp, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Xác thực tài khoản thư viện");
        message.setText("Xin chào,\n\n" +
                "Mã OTP của bạn là: " + otp + "\n" +
                "Hoặc bạn có thể click vào link sau để xác thực: " + link + "\n\n" +
                "OTP và Link có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }
}
