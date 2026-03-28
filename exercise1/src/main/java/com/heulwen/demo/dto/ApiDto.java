package com.heulwen.demo.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiDto<T> {
    @Builder.Default
    int code = 100;
    String message;
    T result;
}
