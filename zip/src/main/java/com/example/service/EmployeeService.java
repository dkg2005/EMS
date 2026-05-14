package com.example.service;

import com.example.dto.EmployeeRequestDTO;

import java.util.List;
import java.util.Map;

public interface EmployeeService {

    Map<String, Object> saveEmployee(EmployeeRequestDTO dto);

    List<Map<String, Object>> getEmployee(Long id);
}
