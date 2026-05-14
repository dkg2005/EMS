package com.example.repository;

import com.example.model.EmployeeAsset;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface EmployeeAssetRepository extends JpaRepository<EmployeeAsset, Long> {

    // Same pattern as Department & Asset
    @Query(nativeQuery = true, value = "SELECT e.id as employee_id, e.name, " +
            "json_agg(json_build_object('id', a.id, 'code', a.code))::text as assets " + // Added ::text here
            "FROM employee_asset ea " +
            "JOIN employee e ON e.id = ea.employee_id " +
            "JOIN asset a ON a.id = ea.asset_id " +
            "WHERE (:employee_id = -1 OR e.id = :employee_id) " +
            "GROUP BY e.id, e.name" )
    List<Map<String, Object>> getEmployeeAsset(@Param("employee_id") Long employee_id);

    @Transactional
    @Modifying
    void deleteByEmployeeId(Long id);
}
//SELECT * FROM employee_asset ea WHERE (:employee_id = -1 OR ea.employee_id = :employee_id);