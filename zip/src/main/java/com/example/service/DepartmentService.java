package com.example.service;

import com.example.dto.DepartmentRequestDTO;
import com.example.model.Department;

import java.util.List;
import java.util.Map;

public interface DepartmentService {

    List<Map<String, Object>>  getDepartment(Long id);

    Map<String, Object> saveDepartment(DepartmentRequestDTO departmentRequestDTO);
}
