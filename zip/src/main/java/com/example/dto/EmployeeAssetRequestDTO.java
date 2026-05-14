package com.example.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EmployeeAssetRequestDTO {

    private List <Long> employeeIds;
    private List<Long> assetIds;
    private String flag;
}
