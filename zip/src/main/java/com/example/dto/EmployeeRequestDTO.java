package com.example.dto;

import com.example.model.CommonStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequestDTO {

    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private LocalDate dateOfJoining;
    private Long departmentId;
    private CommonStatus status;
}
