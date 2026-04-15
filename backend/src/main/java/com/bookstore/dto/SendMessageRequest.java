package com.bookstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank private String number;
    @NotBlank private String message;
}
