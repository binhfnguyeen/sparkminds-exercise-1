package com.heulwen.demo.service;

public interface TokenRedisService {
    void blacklistAccessToken(String accessToken, long remainingTimeInSeconds);
    boolean isAccessTokenBlacklisted(String accessToken);
    void saveRefreshToken(String email, String refreshToken, long durationInDays);
    String getRefreshToken(String email);
    void deleteRefreshToken(String email);
}
