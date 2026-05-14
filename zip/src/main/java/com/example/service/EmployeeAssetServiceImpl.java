package com.example.service;

import com.example.dto.EmployeeAssetRequestDTO;
import com.example.model.EmployeeAsset;
import com.example.repository.EmployeeAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeAssetServiceImpl implements EmployeeAssetService {

    @Autowired
    private EmployeeAssetRepository employeeAssetRepository;

    // READ (single or all)
    @Override
    public List<Map<String, Object>> getEmployeeAsset(Long employee_id) {
        return employeeAssetRepository.getEmployeeAsset(employee_id);
    }

    // CREATE / UPDATE

    @Override
    public Map<String, Object> saveEmployeeAsset(EmployeeAssetRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();

        try {

            // EmployeeId validation (common)
            if (dto.getEmployeeIds() == null || dto.getEmployeeIds().isEmpty()) {
                throw new RuntimeException("EmployeeId list is required");
            }

            String flag = dto.getFlag();

            // DELETE
            if ("DELETE".equals(flag)) {

                if (dto.getEmployeeIds().size() != 1) {
                    throw new RuntimeException("Only one employeeId allowed for DELETE");
                }

                Long employeeId = dto.getEmployeeIds().get(0);
                employeeAssetRepository.deleteByEmployeeId(employeeId);

                response.put("success", true);
                response.put("message", "Employee assets deleted successfully");
                return response;
            }

            // CREATE + UPDATE common validation
            if (dto.getAssetIds() == null || dto.getAssetIds().isEmpty()) {
                throw new RuntimeException("Asset list is required");
            }

            // UPDATE → only one employee allowed
            if ("UPDATE".equals(flag) && dto.getEmployeeIds().size() != 1) {
                throw new RuntimeException("Only one employeeId allowed for UPDATE");
            }

            // COMMON LOGIC FOR CREATE & UPDATE

            List<EmployeeAsset> employeeAssetMapping = new ArrayList<>();
            for (Long empId : dto.getEmployeeIds()) {
                // delete existing mappings
                employeeAssetRepository.deleteByEmployeeId(empId);
                // insert new mappings
                for (Long assetId : dto.getAssetIds()) {
                    EmployeeAsset ea = new EmployeeAsset();
                    ea.setEmployeeId(empId);
                    ea.setAssetId(assetId);
                    employeeAssetMapping.add(ea);
                }
            }
            employeeAssetRepository.saveAll(employeeAssetMapping);

            // Final response
            response.put("success", true);
            response.put("message", "CREATE".equals(flag)
                            ? "Assets assigned to employees successfully"
                            : "Employee assets updated successfully"
            );


        } catch (Exception ex) {

            response.put("success", false);
            response.put("message", ex.getMessage());
        }

        return response;
    }



}
