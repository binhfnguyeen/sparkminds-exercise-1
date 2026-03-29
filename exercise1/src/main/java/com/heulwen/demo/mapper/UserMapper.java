package com.heulwen.demo.mapper;

import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.form.UserCreateForm;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.Role;
import com.heulwen.demo.model.enumType.UserStatus;

import java.time.LocalDateTime;

public class UserMapper {
    public static User map(UserCreateForm form) {
        if (form == null) {
            return null;
        }

        return User.builder()
                .email(form.getEmail())
                .password(form.getPassword())
                .phone(form.getPhone())
                .firstName(form.getFirstName())
                .lastName(form.getLastName())
                .role(Role.USER)
                .status(UserStatus.UNVERIFIED)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static UserDto map(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}
