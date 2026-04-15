package com.bookstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddToCartRequest {
    @NotBlank private String name;
    private Integer price;
    private Integer quantity;
    @NotBlank private String image;
}
