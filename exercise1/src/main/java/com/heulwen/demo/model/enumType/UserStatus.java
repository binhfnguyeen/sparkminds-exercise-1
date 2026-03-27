package com.heulwen.demo.model.enumType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserStatus {
    UNVERIFIED("The user is not verified"),
    ACTIVE("The user is active"),
    BLOCKED("The user is blocked"),
    DELETED("The user is deleted"),
    ;

    private final String message;
}
