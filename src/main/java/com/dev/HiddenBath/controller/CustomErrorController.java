package com.dev.HiddenBath.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.dev.HiddenBath.dto.MenuDTO;
import com.dev.HiddenBath.repository.product.ProductBigSortRepository;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController{

	private String VIEW_PATH = "error/";

	@Autowired
	ProductBigSortRepository productBigSortRepository;
	
	@ModelAttribute("menuList")
	public MenuDTO menuList(MenuDTO menuDto) {
		
		menuDto.setBigSortList(productBigSortRepository.findAllByOrderByBigSortIndexAsc());

		return menuDto;
	}
	
	@GetMapping("/error")
	public String handleError(
			HttpServletRequest request,
			Model model) {
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		if(status != null) {
			int statusCode = Integer.valueOf(status.toString());
			
			if(statusCode == HttpStatus.NOT_FOUND.value()) {
				return VIEW_PATH+"404";
			}else if(statusCode == 500){
				return VIEW_PATH+"500";
			}else {
				return VIEW_PATH+"403";
			}
		}
		return "error";
	}
	
}
