package com.heulwen.demo.service.impl;

import com.heulwen.demo.repository.BorrowRecordRepository;
import com.heulwen.demo.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
    JavaMailSender mailSender;
    private final JavaMailSender javaMailSender;

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

    @Override
    public void sendNewPasswordEmail(String to, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Cấp lại mật khẩu tài khoản");
        message.setText("Xin chào,\n\nMật khẩu tạm thời của bạn là: " + newPassword +
                "\n\nVui lòng đăng nhập và đổi mật khẩu ngay trong lần đăng nhập đầu tiên để bảo mật tài khoản.");
        mailSender.send(message);
    }

    @Override
    public void sendOtpChangeMail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Xác thực thay đổi email");
        message.setText("Xin chào,\n\n" +
                "Mã OTP của bạn là: " + otp + "\n");
        mailSender.send(message);
    }

    @Override
    public void sendBorrowSuccessMail(String to, String bookTitle, String coverImgUrl) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Xác nhận mượn sách thành công: " + bookTitle);
            String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 20px; border-radius: 10px;'>"
                    + "<h2 style='color: #4CAF50; text-align: center;'>Mượn Sách Thành Công!</h2>"
                    + "<p>Chào bạn,</p>"
                    + "<p>Hệ thống ghi nhận bạn đã mượn thành công cuốn sách: <strong>" + bookTitle + "</strong>.</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<img src='" + coverImgUrl + "' alt='Bìa sách " + bookTitle + "' style='max-width: 250px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);' />"
                    + "</div>"
                    + "<p>Vui lòng bảo quản sách cẩn thận và trả lại đúng hạn để các thành viên khác cùng sử dụng nhé!</p>"
                    + "<hr style='border: none; border-top: 1px solid #eaeaea; margin: 20px 0;' />"
                    + "<p style='font-size: 12px; color: #888; text-align: center;'>Trân trọng,<br>Đội ngũ Quản lý Thư viện</p>"
                    + "</div>";
            helper.setText(htmlContent);
            javaMailSender.send(mimeMessage);
            log.info("Successfully sent the book borrowing notification email to {}", to);
        } catch (MessagingException e) {
            log.error("Error sending book borrowing confirmation email to {}: {}", to, e.getMessage());
        }
    }
}
