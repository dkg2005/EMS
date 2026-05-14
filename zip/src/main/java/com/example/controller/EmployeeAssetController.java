package com.example.controller;

import com.example.dto.EmployeeAssetRequestDTO;
import com.example.model.EmployeeAsset;
import com.example.service.EmployeeAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-asset")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeAssetController {

    @Autowired
    private EmployeeAssetService employeeAssetService;

    // CREATE / UPDATE
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveEmployeeAsset(
            @RequestBody EmployeeAssetRequestDTO dto) {

        Map<String, Object> response = employeeAssetService.saveEmployeeAsset(dto);
        return ResponseEntity.ok(response);
    }

    // READ (all or single)
    @GetMapping("/get")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeAsset(
            @RequestParam (required = false) Long employee_id) {

        List<Map<String, Object>> response =
                employeeAssetService.getEmployeeAsset(employee_id == null ? -1 : employee_id);

        return ResponseEntity.ok(response);
    }
}
