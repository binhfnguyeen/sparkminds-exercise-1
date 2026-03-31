package com.heulwen.demo.dto;

import com.heulwen.demo.model.enumType.Role;
import com.heulwen.demo.model.enumType.UserStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDto {
    Long id;
    String email;
    String phone;
    String firstName;
    String lastName;
    Role role;
    UserStatus status;
    boolean mfaEnabled;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
