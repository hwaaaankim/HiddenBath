package com.dev.HiddenBath.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.City;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByProvince_IdOrderByNameAsc(Long provinceId);
    Optional<City> findByNameAndProvinceId(String name, Long provinceId);
    
    /** 공백/대소문자 무시로 시 명칭 매칭 */
    @Query("""
           SELECT c
             FROM City c
            WHERE c.province.id = :provinceId
              AND LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:name, ' ', ''))
           """)
    Optional<City> findByNameNormalizedAndProvinceId(@Param("name") String name,
                                                     @Param("provinceId") Long provinceId);
}