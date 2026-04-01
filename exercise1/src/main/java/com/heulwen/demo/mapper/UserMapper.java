package com.heulwen.demo.mapper;

import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.dto.request.UserCreateRequest;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.Role;
import com.heulwen.demo.model.enumType.UserStatus;

import java.time.LocalDateTime;

public class UserMapper {
    public static User map(UserCreateRequest from) {
        if (from == null) {
            return null;
        }

        return User.builder()
                .email(from.getEmail())
                .password(from.getPassword())
                .phone(from.getPhone())
                .firstName(from.getFirstName())
                .lastName(from.getLastName())
                .role(Role.USER)
                .status(UserStatus.UNVERIFIED)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserResponse map(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status(user.getStatus())
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }
}
