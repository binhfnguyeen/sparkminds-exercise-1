package com.heulwen.demo.service.impl;

import com.heulwen.demo.service.TokenRedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenRedisServiceImpl implements TokenRedisService {

    StringRedisTemplate redisTemplate;

    @Override
    public void blacklistAccessToken(String accessToken, long remainingTimeInSeconds) {
        String key = "blacklist:" + accessToken;
        redisTemplate.opsForValue().set(key, "revoked", Duration.ofSeconds(remainingTimeInSeconds));
        log.info("Access token added to blacklist");
    }

    @Override
    public void saveRefreshToken(String email, String refreshToken, long durationInDays) {
        String key = "RT:" + email;
        redisTemplate.opsForValue().set(key, refreshToken, Duration.ofDays(durationInDays));
        log.info("Refresh token saved to Redis for user: {}", email);
    }

    @Override
    public String getRefreshToken(String email) {
        String key = "RT:" + email;
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteRefreshToken(String email) {
        String key = "RT:" + email;
        redisTemplate.delete(key);
        log.info("Refresh token deleted from Redis for user: {}", email);
    }
}
