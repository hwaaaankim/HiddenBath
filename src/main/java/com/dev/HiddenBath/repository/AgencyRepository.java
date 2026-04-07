package com.dev.HiddenBath.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.Agency;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long>, JpaSpecificationExecutor<Agency> {

    Page<Agency> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * 목록 검색
     * - Province/City/District 는 EntityGraph 로 미리 로딩
     * - contact 검색 시 tel/mobile/fax 모두 하이픈 제거 후 부분일치
     */
    @EntityGraph(attributePaths = {"province", "city", "district"})
    @Query(
        value = """
            SELECT a
              FROM Agency a
             WHERE
                   (:keyword IS NULL OR :keyword = '')
                OR (
                       :type = 'name'
                   AND LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                OR (
                       :type = 'contact'
                   AND (
                          REPLACE(COALESCE(a.tel, ''), '-', '') LIKE CONCAT('%', REPLACE(COALESCE(:keyword, ''), '-', ''), '%')
                       OR REPLACE(COALESCE(a.mobile, ''), '-', '') LIKE CONCAT('%', REPLACE(COALESCE(:keyword, ''), '-', ''), '%')
                       OR REPLACE(COALESCE(a.fax, ''), '-', '') LIKE CONCAT('%', REPLACE(COALESCE(:keyword, ''), '-', ''), '%')
                   )
                )
            """,
        countQuery = """
            SELECT COUNT(a)
              FROM Agency a
             WHERE
                   (:keyword IS NULL OR :keyword = '')
                OR (
                       :type = 'name'
                   AND LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                OR (
                       :type = 'contact'
                   AND (
                          REPLACE(COALESCE(a.tel, ''), '-', '') LIKE CONCAT('%', REPLACE(COALESCE(:keyword, ''), '-', ''), '%')
                       OR REPLACE(COALESCE(a.mobile, ''), '-', '') LIKE CONCAT('%', REPLACE(COALESCE(:keyword, ''), '-', ''), '%')
                       OR REPLACE(COALESCE(a.fax, ''), '-', '') LIKE CONCAT('%', REPLACE(COALESCE(:keyword, ''), '-', ''), '%')
                   )
                )
            """
    )
    Page<Agency> searchByTypeAndKeyword(@Param("type") String type,
                                        @Param("keyword") String keyword,
                                        Pageable pageable);

    /**
     * 단건 조회
     */
    @EntityGraph(attributePaths = {"province", "city", "district"})
    @Query("""
        SELECT a
          FROM Agency a
         WHERE a.id = :id
        """)
    Optional<Agency> findWithRegionsById(@Param("id") Long id);
}