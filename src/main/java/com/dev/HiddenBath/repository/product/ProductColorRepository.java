package com.dev.HiddenBath.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.product.ProductColor;

@Repository
public interface ProductColorRepository extends JpaRepository<ProductColor, Long>{

}
