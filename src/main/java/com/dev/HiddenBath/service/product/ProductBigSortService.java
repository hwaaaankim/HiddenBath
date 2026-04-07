package com.dev.HiddenBath.service.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.HiddenBath.repository.product.ProductBigSortRepository;

@Service
public class ProductBigSortService {

	@Autowired
	ProductBigSortRepository productBigSortRepository;
	
	public void deleteProductBigSort(Long[] id) {
		for(Long i : id) {
			productBigSortRepository.deleteById(i);
		}
	}
}
