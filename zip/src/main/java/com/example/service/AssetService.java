package com.example.service;

import com.example.dto.AssetRequestDTO;
import com.example.model.Asset;

import java.util.List;
import java.util.Map;

public interface AssetService {

    Map<String, Object>  saveAsset(AssetRequestDTO dto);

    List<Map<String, Object>> getAsset(Long id);
}
