package com.heulwen.demo.service;

public interface MfaService {
    String setupMfa(String token);
    String enableMfa(String token, int code);
    boolean verifyCode(String secret, int code);
}
