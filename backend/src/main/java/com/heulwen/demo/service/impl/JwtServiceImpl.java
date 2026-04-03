package com.heulwen.demo.service.impl;

import com.heulwen.demo.model.User;
import com.heulwen.demo.service.JwtService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@Slf4j
public class JwtServiceImpl implements JwtService {

    @Value("${spring.jwt.signer}")
    private String SIGNER_KEY;

    @Override
    public String generateAccessToken(User user) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("heulwen.tech")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create access token", e);
            throw new RuntimeException("Error creating access token", e);
        }
    }

    @Override
    public String generateRefreshToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("heulwen.tech")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(7, ChronoUnit.DAYS)))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create refresh token", e);
            throw new RuntimeException("Error creating refresh token", e);
        }
    }

    @Override
    public String extractEmail(String token) throws ParseException {
        JWTClaimsSet claims = SignedJWT.parse(token).getJWTClaimsSet();
        return claims.getSubject();
    }

    @Override
    public long getRemainingTimeInSeconds(String token) throws ParseException {
        JWTClaimsSet claims = SignedJWT.parse(token).getJWTClaimsSet();
        Date expirationTime = claims.getExpirationTime();
        long diffInMillies = expirationTime.getTime() - System.currentTimeMillis();
        return diffInMillies > 0 ? diffInMillies / 1000 : 0;
    }

    private String buildScope(User user) {
        if (user.getRole() != null) {
            return "ROLE_" + user.getRole().name();
        }
        return "";
    }
}
