package com.example.service;

import com.example.dto.DepartmentRequestDTO;
import com.example.model.CommonStatus;
import com.example.model.Department;
import com.example.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class DepartmentServiceImpl implements DepartmentService{

    @Autowired
    DepartmentRepository departmentRepository;

    @Override
    public List<Map<String, Object>>  getDepartment(Long id) {
        return departmentRepository.getDepartmentById(id);  // made a custom function to get customized acess to getting departments
    }

    @Override
    public Map<String, Object> saveDepartment(DepartmentRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {

            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                throw new RuntimeException("Please mention a unique & non-empty department name");
            }

            Department department;

            // CREATE
            if (dto.getId() == null) {

                if (departmentRepository.existsByName(dto.getName().trim())) {
                    throw new RuntimeException("Department already exists");
                }

                department = new Department();
                department.setCreatedAt(LocalDateTime.now());
            }
            // UPDATE / DELETE
            else {
                department = departmentRepository.findById(dto.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Department not found with id: " + dto.getId()));

                if (departmentRepository.existsByNameAndIdNot(dto.getName().trim(), dto.getId())) {
                    response.put("success", false);
                    response.put("message", "Another department already exists with this name");
                    return response;
                }
            }

            // SOFT DELETE
            if (dto.getStatus() == CommonStatus.DELETED) {
                department.setStatus(CommonStatus.DELETED);
                departmentRepository.save(department);

                response.put("success", true);
                response.put("message", "Department deleted successfully");
                return response;
            }

            // CREATE / UPDATE
            department.setName(dto.getName().trim());
            department.setSize(dto.getSize());

            if (dto.getDescription() != null && !dto.getDescription().trim().isEmpty()) {
                department.setDescription(dto.getDescription().trim());
            }

            department.setModifiedAt(LocalDateTime.now());
            department.setStatus(dto.getStatus());

            Department saved = departmentRepository.save(department);

            response.put("success", true);
            if(dto.getId() == null){
                response.put("message", "Department created successfully");
            }else {
                response.put("message", "Department saved successfully");
            }
            response.put("data", saved);

        } catch (Exception ex) {

            response.put("success", false);
            response.put("message", ex.getMessage());
        }

        return response;
    }

}
