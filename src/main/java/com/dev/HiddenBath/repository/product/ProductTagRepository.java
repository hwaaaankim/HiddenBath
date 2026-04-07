package com.dev.HiddenBath.repository.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.product.ProductTag;

@Repository
public interface ProductTagRepository extends JpaRepository<ProductTag, Long>{

}
