package com.example.repository;

import com.example.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    // Used during CREATE to avoid duplicate asset codes
    boolean existsByAssetCode(String assetCode);

    @Query(nativeQuery = true,value = "SELECT * FROM asset WHERE (:id = -1 OR id = :id) AND status != 'DELETED' ORDER BY id DESC ;")
    List<Map<String, Object>> getAssetById(@Param("id") Long id);

    boolean existsByAssetCodeAndIdNot(String code, Long id);

}
