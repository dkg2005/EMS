package com.example.controller;

import com.example.dto.EmployeeRequestDTO;
import com.example.model.Employee;
import com.example.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveEmployee(
            @RequestBody EmployeeRequestDTO dto) {

        return ResponseEntity.ok(employeeService.saveEmployee(dto));
    }

    @GetMapping("/get")
    public ResponseEntity<List<Map<String, Object>>> getEmployee(
            @RequestParam @Nullable Long id) {

        return ResponseEntity.ok(
                employeeService.getEmployee(id == null ? -1 : id)
        );
    }
}
