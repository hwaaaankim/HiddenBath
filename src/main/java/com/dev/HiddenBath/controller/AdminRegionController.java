package com.dev.HiddenBath.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.HiddenBath.model.City;
import com.dev.HiddenBath.model.District;
import com.dev.HiddenBath.model.Province;
import com.dev.HiddenBath.service.RegionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/api/regions")
public class AdminRegionController {

    private final RegionService regionService;

    @GetMapping("/provinces")
    public List<Province> provinces() {
        return regionService.getProvinces();
    }

    @GetMapping("/cities")
    public List<City> cities(@RequestParam Long provinceId) {
        return regionService.getCities(provinceId);
    }

    @GetMapping("/districts")
    public List<District> districts(@RequestParam Long provinceId,
                                    @RequestParam(required = false) Long cityId) {
        return regionService.getDistricts(provinceId, cityId);
    }

    /** 다음 우편번호 결과(시도/시군구)만으로 Province/City/District ID 자동 매핑 */
    @GetMapping("/resolve")
    public ResponseEntity<RegionService.RegionResolved> resolve(
            @RequestParam String sido,
            @RequestParam(required = false) String sigungu
    ) {
        var res = regionService.resolveByNames(sido, sigungu);
        return ResponseEntity.ok(res);
    }
}