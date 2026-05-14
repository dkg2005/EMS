package com.example.repository;

import com.example.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    Optional<Employee> findByEmail(String email);

    @Query(nativeQuery = true, value = "SELECT * FROM employee e WHERE (:id = -1 OR e.id = :id) and e.status <> 'DELETED' ORDER BY e.id DESC")
    List<Map<String, Object>> getEmployeeById(@Param("id") Long id);
}
