package com.heulwen.demo.service;

import com.heulwen.demo.model.User;

import java.text.ParseException;

public interface JwtService {
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    String extractEmail(String token) throws ParseException;
    long getRemainingTimeInSeconds(String token) throws ParseException;
}
