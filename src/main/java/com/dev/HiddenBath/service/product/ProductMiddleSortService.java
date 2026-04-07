package com.dev.HiddenBath.service.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.HiddenBath.repository.product.ProductMiddleSortRepository;

@Service
public class ProductMiddleSortService {

	@Autowired
	ProductMiddleSortRepository productMiddleSortRepository;
	
	public void deleteProductMiddleSort(Long[] id) {
		for(Long i : id) {
			productMiddleSortRepository.deleteById(i);
		}
	}
}
