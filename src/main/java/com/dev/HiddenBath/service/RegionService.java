package com.dev.HiddenBath.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.dev.HiddenBath.model.City;
import com.dev.HiddenBath.model.District;
import com.dev.HiddenBath.model.Province;
import com.dev.HiddenBath.repository.CityRepository;
import com.dev.HiddenBath.repository.DistrictRepository;
import com.dev.HiddenBath.repository.ProvinceRepository;
import com.dev.HiddenBath.utils.KRegionNormalizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegionService {

	private final ProvinceRepository provinceRepository;
	private final CityRepository cityRepository;
	private final DistrictRepository districtRepository;

	public List<Province> getProvinces() {
		return provinceRepository.findAll().stream().sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
				.toList();
	}

	public List<City> getCities(Long provinceId) {
		if (provinceId == null)
			return List.of();
		return cityRepository.findByProvince_IdOrderByNameAsc(provinceId);
	}

	public List<District> getDistricts(Long provinceId, Long cityId) {
		if (cityId != null) {
			return districtRepository.findByCity_IdOrderByNameAsc(cityId);
		}
		if (provinceId != null) {
			return districtRepository.findByProvince_IdOrderByNameAsc(provinceId);
		}
		return List.of();
	}

	// ===== 새로 추가: 이름 기반 → ID 해석 (KRegionNormalizer 사용) =====
	@Transactional(readOnly = true)
	public RegionResolved resolveByNames(String sido, String sigungu) {
		if (!StringUtils.hasText(sido)) {
			return new RegionResolved(null, null, null, null, null, null);
		}

		var aliases = KRegionNormalizer.aliasesForProvince(sido);
		var province = provinceRepository.findFirstByNameInNormalized(aliases)
				.orElseThrow(() -> new IllegalArgumentException("등록되지 않은 시/도: " + sido));

		// AgencyService의 parseSigungu와 동일 로직을 공유하고 싶다면 유틸로 빼도 좋습니다.
		var parsed = RegionParsing.parseSigungu(sigungu); // 아래 유틸 클래스 참고

		Long cityId = null;
		Long districtId = null;
		String cityName = null;
		String districtName = null;

		if (parsed.city() != null && parsed.district() != null) {
			var city = cityRepository.findByNameNormalizedAndProvinceId(parsed.city(), province.getId())
					.orElseThrow(() -> new IllegalArgumentException("시/군 없음: " + parsed.city()));
			var dist = districtRepository.findByNameNormalizedAndCityId(parsed.district(), city.getId())
					.orElseThrow(() -> new IllegalArgumentException("구 없음: " + parsed.district()));

			cityId = city.getId();
			districtId = dist.getId();
			cityName = city.getName();
			districtName = dist.getName();
		} else if (parsed.city() != null) {
			var city = cityRepository.findByNameNormalizedAndProvinceId(parsed.city(), province.getId())
					.orElseThrow(() -> new IllegalArgumentException("시/군 없음: " + parsed.city()));
			cityId = city.getId();
			cityName = city.getName();
		} else if (parsed.district() != null) {
			var dist = districtRepository.findByNameNormalizedAndProvinceId(parsed.district(), province.getId())
					.orElseThrow(() -> new IllegalArgumentException("구 없음: " + parsed.district()));
			districtId = dist.getId();
			districtName = dist.getName();
		}

		return new RegionResolved(province.getId(), cityId, districtId, province.getName(), cityName, districtName);
	}

	public record RegionResolved(Long provinceId, Long cityId, Long districtId, String provinceName, String cityName,
			String districtName) {
	}

	// 간단 파서(AgencyService 것과 동일 규칙)
	static final class RegionParsing {
		static ParsedSigungu parseSigungu(String raw) {
			if (!StringUtils.hasText(raw))
				return new ParsedSigungu(null, null);
			String s = raw.trim().replaceAll("\\s+", " ");
			String[] parts = s.split("\\s+");
			String city = null;
			String district = null;

			if (parts.length >= 2 && parts[parts.length - 1].endsWith("구")) {
				for (int i = 0; i < parts.length - 1; i++) {
					if (parts[i].endsWith("시") || parts[i].endsWith("군")) {
						city = String.join("", java.util.Arrays.copyOfRange(parts, 0, i + 1));
						district = parts[parts.length - 1];
						return new ParsedSigungu(city, district);
					}
				}
			}
			if (parts.length == 1 && parts[0].endsWith("구")) {
				district = parts[0];
				return new ParsedSigungu(null, district);
			}
			if (parts.length == 1 && (parts[0].endsWith("시") || parts[0].endsWith("군"))) {
				city = parts[0];
				return new ParsedSigungu(city, null);
			}
			return new ParsedSigungu(s.replace(" ", ""), null);
		}

		record ParsedSigungu(String city, String district) {
		}
	}
}