package com.heulwen.demo.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MemberUpdateRequest {
    String firstName;
    String lastName;
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid phone number format.")
    String phone;
    LocalDate dateOfBirth;
}
