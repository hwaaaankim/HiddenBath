package com.dev.HiddenBath.service.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.HiddenBath.repository.product.ProductOptionRepository;

@Service
public class ProductOptionService {

	@Autowired
	ProductOptionRepository productOptionRepository;
	
	public void deleteProductOption(Long[] id) {
		for(Long i : id) {
			productOptionRepository.deleteById(i);
		}
	}
}
