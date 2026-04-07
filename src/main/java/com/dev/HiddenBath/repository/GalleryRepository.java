package com.dev.HiddenBath.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.Gallery;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long>{

	List<Gallery> findAllBy(Pageable pageable);
	List<Gallery> findAllByOrderByIdDesc();
}
