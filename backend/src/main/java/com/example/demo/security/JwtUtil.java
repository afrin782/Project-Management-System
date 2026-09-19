package com.example.demo.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${JWT_SECRET}")
    private String secretKey;

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000))
                .signWith(
                        Keys.hmacShaKeyFor(
                                secretKey.getBytes(
                                        StandardCharsets.UTF_8)))
                .compact();
    }

    public String extractEmail(String token) {

        try {

            Claims claims = Jwts.parser()
                    .verifyWith(
                            Keys.hmacShaKeyFor(
                                    secretKey.getBytes(
                                            StandardCharsets.UTF_8)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();

        } catch (Exception e) {

            return null;
        }
    }
}