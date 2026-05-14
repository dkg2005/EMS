package com.example.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.sql.SQLType;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "asset")
public class Asset {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String assetName;

    @Column(name = "code", nullable = false, unique = true)
    private String assetCode;

    @Column(name = "description")
    private String description;

    @Column(name = "status", nullable = false)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private AssetStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "modified_at", nullable = true)
    private LocalDateTime modifiedAt;

    public enum AssetStatus {
        AVAILABLE,
        ASSIGNED,
        MAINTENANCE,
        REQUEST,
        DELETED
    }
}
