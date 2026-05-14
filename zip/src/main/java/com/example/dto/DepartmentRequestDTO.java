package com.example.dto;

import com.example.model.CommonStatus;
import lombok.Data;

@Data
public class DepartmentRequestDTO {
    public Long id;
    private String name;
    private Integer size;
    private String description;
    private CommonStatus status;
}
