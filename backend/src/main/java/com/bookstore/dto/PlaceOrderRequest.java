package com.bookstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlaceOrderRequest {
    @NotBlank private String name;
    @NotBlank private String number;
    @Email @NotBlank private String email;
    @NotBlank private String method;
    @NotBlank private String address;
}
