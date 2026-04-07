package com.dev.HiddenBath.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.HiddenBath.model.OnlineAgency;

public interface OnlineAgencyRepository extends JpaRepository<OnlineAgency, Long> {

    Page<OnlineAgency> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<OnlineAgency> findByContactContaining(String keyword, Pageable pageable);
}