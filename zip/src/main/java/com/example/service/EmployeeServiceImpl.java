package com.example.service;

import com.example.dto.EmployeeRequestDTO;
import com.example.model.CommonStatus;
import com.example.model.Employee;
import com.example.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Map<String, Object> saveEmployee(EmployeeRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {

            Employee employee;

            // BASIC VALIDATIONS
            if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Employee email is required");
            }

            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                throw new RuntimeException("Employee name is required");
            }

            // CREATE
            if (dto.getId() == null) {

                if (employeeRepository.existsByEmail(dto.getEmail().trim())) {
                    throw new RuntimeException("Employee email already exists");
                }

                employee = new Employee();
                employee.setCreatedAt(LocalDateTime.now());
            }

            // UPDATE / DELETE
            else {
                employee = employeeRepository.findById(dto.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Employee not found with id: " + dto.getId()));
            }

            // SOFT DELETE
            if (dto.getStatus() == CommonStatus.DELETED) {
                employee.setStatus(CommonStatus.DELETED);
                employeeRepository.save(employee);

                response.put("success", true);
                response.put("message", "Employee deleted successfully");
                return response;
            }

            // CREATE / UPDATE
            employee.setName(dto.getName().trim());
            employee.setEmail(dto.getEmail().trim());
            employee.setPhone(dto.getPhone() != null ? dto.getPhone().trim() : null);
            employee.setPassword(passwordEncoder.encode(dto.getPassword().trim())); // encrypt later
            employee.setDepartmentId(dto.getDepartmentId());
            employee.setDateOfJoining(dto.getDateOfJoining());
            employee.setModifiedAt(LocalDateTime.now());
            employee.setStatus(dto.getStatus());

            Employee saved = employeeRepository.save(employee);

            response.put("success", true);
            if (dto.getId() == null) {
                response.put("message", "Employee created successfully");
            } else {
                response.put("message", "Employee saved successfully");
            }
            response.put("data", saved);

        } catch (Exception ex) {

            response.put("success", false);
            response.put("message", ex.getMessage());
        }

        return response;
    }


    @Override
    public List<Map<String, Object>> getEmployee(Long id) {
        return employeeRepository.getEmployeeById(id);
    }
}
