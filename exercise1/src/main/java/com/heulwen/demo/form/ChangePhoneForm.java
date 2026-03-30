package com.heulwen.demo.form;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePhoneForm {
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid phone number format.")
    String phone;

}
