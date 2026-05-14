package com.example.service;

import com.example.dto.AssetRequestDTO;
import com.example.model.Asset;
import com.example.model.Asset.AssetStatus;
import com.example.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AssetServiceImpl implements AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Override
    public Map<String, Object> saveAsset(AssetRequestDTO dto) {

        Map<String, Object> response = new HashMap<>();
        try  {
            Asset asset;
            // CREATE
            if (dto.getId() == null) {

                if (assetRepository.existsByAssetCode(dto.getCode())) {
                    response.put("success", false);
                    response.put("message", "Asset code already exist");
                    return response;
                }

                asset = new Asset();
                asset.setCreatedAt(LocalDateTime.now());
            }
            // UPDATE
            else {
                asset = assetRepository.findById(dto.getId())
                        .orElseThrow(() ->
                                new RuntimeException("Asset not found with id: " + dto.getId()));

                if (assetRepository.existsByAssetCodeAndIdNot(dto.getCode(), dto.getId())) {
                    response.put("success", false);
                    response.put("message", "Asset code already exists");
                    return response;
                }
            }

            // SOFT DELETE
            if (dto.getStatus() == AssetStatus.DELETED) {
                asset.setStatus(AssetStatus.DELETED);
                assetRepository.save(asset);

                response.put("success", true);
                response.put("message", "Asset deleted successfully");
                return response;
            }

            asset.setAssetName(dto.getName().trim());
            asset.setAssetCode(dto.getCode().trim());
            asset.setStatus(dto.getStatus());
            asset.setModifiedAt(LocalDateTime.now());

            if (dto.getDescription() != null && !dto.getDescription().trim().isEmpty()) {
                asset.setDescription(dto.getDescription().trim());
            }

            Asset saved = assetRepository.save(asset);

            response.put("success", true);
            if (dto.getId() == null) {
                response.put("message", "Asset created successfully");
            } else {
                response.put("message", "Asset saved successfully");
            }
            response.put("data", saved);

        } catch (Exception ex) {
            response.put("success", false);
            response.put("message", ex.getMessage());
        }

        return response;
    }

    @Override
    public List<Map<String, Object>> getAsset(Long id) {
        return assetRepository.getAssetById(id);
    }
}
