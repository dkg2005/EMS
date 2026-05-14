package com.example.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthRequestDTO {

    private String name;        // signup only
    private String email;       // login + signup
    private String password;    // login + signup
    private Long departmentId;  // signup only
}
