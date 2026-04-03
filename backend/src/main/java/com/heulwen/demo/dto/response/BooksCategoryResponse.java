package com.heulwen.demo.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BooksCategoryResponse {
    Long categoryId;
    String name;
    List<BookResponse> books;
}
