package com.dev.HiddenBath.repository.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.HiddenBath.model.product.ProductImage;

import jakarta.transaction.Transactional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long>{

	@Transactional
	int deleteAllByProductId(Long id);
	
	List<ProductImage> findAllByProductId(Long id);
}
