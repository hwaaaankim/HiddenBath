package com.dev.HiddenBath.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.District;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByProvince_IdOrderByNameAsc(Long provinceId);
    List<District> findByCity_IdOrderByNameAsc(Long cityId);
    Optional<District> findByNameAndCityId(String name, Long cityId);
    Optional<District> findByNameAndProvinceId(String name, Long provinceId);
    
    /** 공백/대소문자 무시 - 시 기준 */
    @Query("""
           SELECT d
             FROM District d
            WHERE d.city.id = :cityId
              AND LOWER(REPLACE(d.name, ' ', '')) = LOWER(REPLACE(:name, ' ', ''))
           """)
    Optional<District> findByNameNormalizedAndCityId(@Param("name") String name,
                                                     @Param("cityId") Long cityId);

    /** 공백/대소문자 무시 - 도(광역) 기준 */
    @Query("""
           SELECT d
             FROM District d
            WHERE d.province.id = :provinceId
              AND LOWER(REPLACE(d.name, ' ', '')) = LOWER(REPLACE(:name, ' ', ''))
           """)
    Optional<District> findByNameNormalizedAndProvinceId(@Param("name") String name,
                                                         @Param("provinceId") Long provinceId);
}