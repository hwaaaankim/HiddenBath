package com.dev.HiddenBath.repository.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.HiddenBath.model.product.ProductFile;

import jakarta.transaction.Transactional;

public interface ProductFileRepository extends JpaRepository<ProductFile, Long>{

	@Transactional
	int deleteAllByProductId(Long id);
	
	List<ProductFile> findAllByProductId(Long id);
}
