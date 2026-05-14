package com.example.service;

import com.example.dto.EmployeeAssetRequestDTO;

import java.util.List;
import java.util.Map;

public interface EmployeeAssetService {

    List<Map<String, Object>> getEmployeeAsset(Long employee_id);

    Map<String, Object> saveEmployeeAsset(EmployeeAssetRequestDTO dto);
}
