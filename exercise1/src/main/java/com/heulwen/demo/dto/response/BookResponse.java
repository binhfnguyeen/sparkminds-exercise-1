package com.heulwen.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookResponse {
    Long id;
    String title;
    String author;
    String description;
    Integer quantity;
    String imgUrl;
    boolean deleted;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    CategoryResponse category;
}
