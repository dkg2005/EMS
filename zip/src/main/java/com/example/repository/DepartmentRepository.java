package com.example.repository;

import com.example.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface DepartmentRepository extends JpaRepository<Department, Long>{

    boolean existsByName(String name);

    @Query(nativeQuery = true, value = "SELECT * FROM department d where (:id = -1 or :id = d.id )AND d.status <> 'DELETED' order by d.modified_at desc;")
    List<Map<String, Object>> getDepartmentById(@Param("id") Long id);

    boolean existsByNameAndIdNot(String trim, Long id);
}
