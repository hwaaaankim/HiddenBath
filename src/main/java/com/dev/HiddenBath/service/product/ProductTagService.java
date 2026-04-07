package com.dev.HiddenBath.service.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.HiddenBath.repository.product.ProductTagRepository;

@Service
public class ProductTagService {

	@Autowired
	ProductTagRepository productTagRepository;
	
	public void deleteProductTag(Long[] id) {
		for(Long i : id) {
			productTagRepository.deleteById(i);
		}
	}
}
