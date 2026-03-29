package com.heulwen.demo.form;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateForm {
    String email;
    String password;
    String firstName;
    String lastName;
}
