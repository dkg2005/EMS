package com.example.controller;

import com.example.dto.AssetRequestDTO;
import com.example.model.Asset;
import com.example.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asset")
@CrossOrigin(origins = "http://localhost:4200")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object> > saveAsset(@RequestBody AssetRequestDTO dto) {
        return ResponseEntity.ok(assetService.saveAsset(dto));
    }

    @GetMapping("/get")
    public ResponseEntity<List<Map<String, Object>>> getAsset(
            @RequestParam @Nullable Long id) {

        return ResponseEntity.ok(
                assetService.getAsset(id == null ? -1 : id)
        );
    }
}
