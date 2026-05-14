package com.example.dto;

import com.example.model.Asset.AssetStatus;
import lombok.Data;

@Data
public class AssetRequestDTO {
    private Long id;
    private String name;
    private String code;
    private String description;
    private AssetStatus status;
}
