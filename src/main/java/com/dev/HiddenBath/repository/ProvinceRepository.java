package com.dev.HiddenBath.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.Province;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Long> {
	Optional<Province> findByName(String name);
	
	/** 별칭 세트(소문자,공백제거)로 정규화 비교하여 첫 번째 Province 반환 */
    @Query("""
           SELECT p
             FROM Province p
            WHERE LOWER(REPLACE(p.name, ' ', '')) IN (:normalizedNames)
           """)
    Optional<Province> findFirstByNameInNormalized(@Param("normalizedNames") Collection<String> normalizedNames);
}