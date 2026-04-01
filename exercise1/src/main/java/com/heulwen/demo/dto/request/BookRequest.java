package com.heulwen.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookRequest {

    @NotBlank(message = "The book title cannot be empty.")
    String title;

    @NotBlank(message = "The book author cannot be empty.")
    String author;

    String description;

    @NotNull(message = "The book quantity cannot be empty.")
    @Min(value = 0, message = "The number of books cannot be negative.")
    Integer quantity;

    String imgUrl;

    @NotNull(message = "Category ID cannot be empty.")
    Long categoryId;

}
