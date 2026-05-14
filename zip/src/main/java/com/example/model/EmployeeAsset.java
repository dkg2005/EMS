package com.example.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "employee_asset")
public class EmployeeAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    // FK to employee table
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    // FK to asset table
    @Column(name = "asset_id", nullable = false)
    private Long assetId;
}
