package com.dev.HiddenBath.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dev.HiddenBath.dto.AgencyResponse;
import com.dev.HiddenBath.dto.PageResponse;
import com.dev.HiddenBath.model.City;
import com.dev.HiddenBath.model.District;
import com.dev.HiddenBath.model.Province;
import com.dev.HiddenBath.service.AgencyFrontService;
import com.dev.HiddenBath.service.RegionService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class FrontAgencyController {

	private final RegionService regionService;
	private final AgencyFrontService agencyFrontService;

	@Value("${kakao.javascript.key:}")
	private String kakaoKey;

	@GetMapping("/findAgency")
	public String findAgency(Model model) {
		List<Province> provinces = regionService.getProvinces();
		model.addAttribute("kakaoKey", kakaoKey);
		model.addAttribute("provinces", provinces);
		model.addAttribute("pageSizeOptions", List.of(12, 24, 36, 48));
		return "front/findAgency";
	}

	@GetMapping("/findOnlineAgency")
    public String findOnlineAgencyPage() {

		return "front/findOnlineAgency";
    }
	
	// --- Regions API ---
	@GetMapping("/api/regions/provinces")
	@ResponseBody
	public List<Province> apiProvinces() {
		return regionService.getProvinces();
	}

	@GetMapping("/api/regions/cities")
	@ResponseBody
	public List<City> apiCities(@RequestParam Long provinceId) {
		System.out.println(provinceId);
		return regionService.getCities(provinceId);
	}

	@GetMapping("/api/regions/districts")
	@ResponseBody
	public List<District> apiDistricts(@RequestParam Long provinceId, @RequestParam(required = false) Long cityId) {
		return regionService.getDistricts(provinceId, cityId);
	}

	// Agencies API  —— ★ 핵심: ID 기반으로 변경
    @GetMapping("/api/agencies")
    @ResponseBody
    public PageResponse<AgencyResponse> apiAgencies(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(required = false) Long provinceId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        return agencyFrontService.searchByIds(page, size, provinceId, cityId, districtId, keyword, lat, lng);
    }

	@GetMapping("/api/agencies/{id}")
	public ResponseEntity<AgencyResponse> apiAgencyDetail(@PathVariable Long id,
			@RequestParam(required = false) Double lat, @RequestParam(required = false) Double lng) {
		return ResponseEntity.ok(agencyFrontService.getOne(id, lat, lng));
	}
}