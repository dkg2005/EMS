package com.example.controller;

import com.example.dto.DepartmentRequestDTO;
import com.example.model.Department;
import com.example.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/department")
@CrossOrigin(origins = "http://localhost:4200")
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveDepartment(
            @RequestBody DepartmentRequestDTO departmentRequestDTO) {
        Map<String, Object> savedDepartment = departmentService.saveDepartment(departmentRequestDTO);
        return ResponseEntity.ok(savedDepartment);
    }

    @GetMapping("/get")
    public ResponseEntity<List<Map<String, Object>> > getAllDepartments(@RequestParam @Nullable Long id) {

//        System.out.println("request is COMING" );
        List<Map<String, Object>>  departments =
                departmentService.getDepartment(id == null ? -1 : id);

        return ResponseEntity.ok(departments);
    }

}
