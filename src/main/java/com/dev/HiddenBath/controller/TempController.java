package com.dev.HiddenBath.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.dev.HiddenBath.model.product.MiddleSort;
import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.repository.ConstructionRepository;
import com.dev.HiddenBath.repository.product.ProductBigSortRepository;
import com.dev.HiddenBath.repository.product.ProductColorRepository;
import com.dev.HiddenBath.repository.product.ProductMiddleSortRepository;
import com.dev.HiddenBath.repository.product.ProductRepository;
import com.dev.HiddenBath.repository.product.ProductTagRepository;
import com.dev.HiddenBath.service.GalleryService;
import com.dev.HiddenBath.service.product.ProductService;

@Controller
@RequestMapping("/temp")
public class TempController {

	
	@Autowired
	ProductRepository productRepository;
	
	@Autowired
	ProductBigSortRepository productBigSortRepository;
	
	@Autowired
	ProductMiddleSortRepository productMiddleSortRepository;
	
	@Autowired
	ProductColorRepository productColorRepository;
	
	@Autowired
	ProductTagRepository productTagRepository;
	
	@Autowired
	ProductService productService;
	
	@Autowired
	GalleryService galleryService;
	
	@Autowired
	ConstructionRepository constructionRepository;
	
	
	@RequestMapping(value = "/productList/{id}",
			method = {RequestMethod.GET, RequestMethod.POST})
	public String productList(
			Model model,
			@PathVariable Long id,
			@RequestParam(required = false, defaultValue = "0") Long middleId,
			@RequestParam(required = false, defaultValue = "0") Long tagId,
			@RequestParam(required = false, defaultValue = "0") Long colorId,
			@PageableDefault(size=12) Pageable pageable
			) {
		Page<Product> products = null;
		if(id == 7l) {
			products = productRepository.findAllByOrderByProductIndexAsc(pageable);
			List<MiddleSort> middles = new ArrayList<MiddleSort>();
			MiddleSort sort = new MiddleSort();
			sort.setName("전체제품조회");
			sort.setId(0l);
			middles.add(sort);
			model.addAttribute("middleSortName", "분류전체");
			model.addAttribute("middleSorts", middles);
		}else {
			products = productService.getProductsByCriteria(tagId, colorId, middleId, id, pageable);
			model.addAttribute("middleSorts", productMiddleSortRepository.findAllByBigSort(productBigSortRepository.findById(id).get()));
		}
		int startPage = Math.max(1, products.getPageable().getPageNumber() - 4);
		int endPage = Math.min(products.getTotalPages(), products.getPageable().getPageNumber() + 4);
		model.addAttribute("startPage", startPage);
		model.addAttribute("endPage", endPage);
		model.addAttribute("bigSortName", productBigSortRepository.findById(id).get().getName());
		model.addAttribute("products", products);
		model.addAttribute("tagId", tagId);
		model.addAttribute("colorId", colorId);
		model.addAttribute("middleSortId", middleId);
		model.addAttribute("bigSortId", id);
		model.addAttribute("bigSorts", productBigSortRepository.findAll());
		model.addAttribute("tags", productTagRepository.findAll());
		model.addAttribute("colors", productColorRepository.findAll());
		
		return "temp/productList";
	}
	
	@GetMapping("/productDetail/{id}")
	public String productDetail(
			@PathVariable Long id,
			Model model
			) {
		
		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
		List<Product> relatedProducts = productService.getRandomProductsByTag(product);

		model.addAttribute("product", product);
        model.addAttribute("relatedProducts", relatedProducts);
		return "temp/productDetail";
	}
	
	@GetMapping("/productDetailAdvanced/{id}")
	public String productDetailAdvanced(
			@PathVariable Long id,
			Model model
			) {
		
		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
		List<Product> relatedProducts = productService.getRandomProductsByTag(product);
		int centerRotationNumber = Math.round(product.getProductRotationNumber() / 2.0f);
        model.addAttribute("centerRotationNumber", centerRotationNumber);
		model.addAttribute("product", product);
        model.addAttribute("relatedProducts", relatedProducts);
		return "temp/productDetailAdvanced";
	}
}


















