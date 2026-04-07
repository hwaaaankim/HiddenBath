package com.dev.HiddenBath.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.product.ProductSize;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize, Long>{

}
