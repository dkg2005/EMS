package com.example.service;

import com.example.dto.AuthRequestDTO;
import com.example.dto.JwtResponseDTO;
import com.example.model.CommonStatus;
import com.example.model.Department;
import com.example.model.Employee;
import com.example.repository.DepartmentRepository;
import com.example.repository.EmployeeRepository;
import com.example.util.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtils jwtUtils) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    // ✅ SIGNUP
    @Override
    public Map<String, Object> signup(AuthRequestDTO request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Check if email exists
            if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return response;
            }

            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            Employee employee = new Employee();
            employee.setName(request.getName());
            employee.setEmail(request.getEmail());
            employee.setPassword(passwordEncoder.encode(request.getPassword()));
            employee.setDepartmentId(department.getId());
            employee.setDateOfJoining(LocalDate.now());
            employee.setStatus(CommonStatus.ACTIVE);
            employee.setCreatedAt(LocalDateTime.now());

            employeeRepository.save(employee);

            response.put("success", true);
            response.put("message", "User registered successfully");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }


    // ✅ LOGIN
    @Override
    public Map<String, Object> login(AuthRequestDTO request) {

        Map<String, Object> response = new HashMap<>();

        try {
            Employee employee = employeeRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with this email"));

            if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid password");
                return response;
            }

            String token = jwtUtils.generateToken(employee.getEmail());

            JwtResponseDTO jwtResponse = new JwtResponseDTO(
                    token,
                    employee.getId(),
                    employee.getName(),
                    employee.getEmail()
            );

            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", jwtResponse);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

}
