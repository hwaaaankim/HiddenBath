package com.dev.HiddenBath.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.dev.HiddenBath.dto.AgencyResponse;
import com.dev.HiddenBath.dto.PageResponse;
import com.dev.HiddenBath.mapper.AgencyMapper;
import com.dev.HiddenBath.model.Agency;
import com.dev.HiddenBath.repository.AgencyRepository;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgencyFrontService {

	private final AgencyRepository agencyRepository;

	public PageResponse<AgencyResponse> searchByIds(Integer page, Integer size, Long provinceId, Long cityId,
			Long districtId, String keyword, Double userLat, Double userLng) {
		final int p = (page == null || page < 0) ? 0 : page;
		final int s = (size == null || size < 1) ? 12 : size;

		// 1) Specification (FK ID & keyword)
		Specification<Agency> spec = (root, cq, cb) -> {
			List<Predicate> list = new ArrayList<>();

			if (provinceId != null) {
				list.add(cb.equal(root.get("province").get("id"), provinceId));
			}
			if (cityId != null) {
				list.add(cb.equal(root.get("city").get("id"), cityId));
			}
			if (districtId != null) {
				list.add(cb.equal(root.get("district").get("id"), districtId));
			}
			if (StringUtils.hasText(keyword)) {
				String like = "%" + keyword.trim().toLowerCase() + "%";
				list.add(cb.or(cb.like(cb.lower(root.get("name")), like),
						cb.like(cb.lower(root.get("roadAddress")), like),
						cb.like(cb.lower(root.get("jibunAddress")), like)));
			}
			return cb.and(list.toArray(new Predicate[0]));
		};

		// 2) 전량 조회 → 거리 계산 → 가까운 순 정렬
		List<Agency> all = agencyRepository.findAll(spec);

		final boolean hasUserPos = (userLat != null && userLng != null);
		Map<Long, Double> distanceMap = new HashMap<>();

		if (hasUserPos) {
			for (Agency a : all) {
				distanceMap.put(a.getId(), haversineKm(userLat, userLng, a.getLatitude(), a.getLongitude()));
			}
		}

		Comparator<Agency> byDistanceAscNullLast = (a1, a2) -> {
			Double d1 = distanceMap.get(a1.getId());
			Double d2 = distanceMap.get(a2.getId());

			if (d1 == null && d2 == null) {
				return String.CASE_INSENSITIVE_ORDER.compare(a1.getName(), a2.getName());
			}
			if (d1 == null)
				return 1;
			if (d2 == null)
				return -1;

			int cmp = Double.compare(d1, d2);
			if (cmp != 0)
				return cmp;

			return String.CASE_INSENSITIVE_ORDER.compare(a1.getName(), a2.getName());
		};

		if (hasUserPos) {
			all.sort(byDistanceAscNullLast);
		} else {
			all.sort(Comparator.comparing(Agency::getName, String.CASE_INSENSITIVE_ORDER));
		}

		// 3) 수동 페이징
		int total = all.size();
		int fromIndex = Math.min(p * s, total);
		int toIndex = Math.min(fromIndex + s, total);
		List<Agency> pageList = (fromIndex < toIndex) ? all.subList(fromIndex, toIndex) : List.of();

		// 4) DTO 변환
		List<AgencyResponse> content = pageList.stream()
				.map(a -> AgencyMapper.toResponse(a, distanceMap.get(a.getId()))).collect(Collectors.toList());

		int totalPages = (int) Math.ceil(total / (double) s);

		return PageResponse.<AgencyResponse>builder().content(content).number(p).size(s).totalElements((long) total)
				.totalPages(totalPages).first(p == 0).last(p >= totalPages - 1).build();
	}

	/**
	 * 단건 조회(선택) 사용자 좌표로 거리 계산 포함.
	 */
	public AgencyResponse getOne(Long id, Double userLat, Double userLng) {
		Agency a = agencyRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("대리점을 찾을 수 없습니다. id=" + id));

		Double dk = null;
		if (userLat != null && userLng != null && a.getLatitude() != null && a.getLongitude() != null) {
			// BigDecimal 좌표를 받아 double 로 변환하여 계산
			dk = haversineKm(userLat, userLng, a.getLatitude(), a.getLongitude());
		}
		return AgencyMapper.toResponse(a, dk);
	}

	// =========================
	// Haversine Utilities (km)
	// =========================

	/**
	 * 기본(double) 버전
	 */
	private static Double haversineKm(double lat1, double lon1, double lat2, double lon2) {
		double R = 6371.0;
		double dLat = Math.toRadians(lat2 - lat1);
		double dLon = Math.toRadians(lon2 - lon1);
		double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1))
				* Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		double km = R * c;
		return Math.round(km * 10.0) / 10.0; // 소수 1자리
	}

	/**
	 * 오버로드: (Double, Double, BigDecimal, BigDecimal) - userLat/lng 은 프론트에서 넘어오는
	 * Double - Agency 좌표는 DB BigDecimal
	 */
	private static Double haversineKm(Double lat1, Double lon1, BigDecimal lat2, BigDecimal lon2) {
		if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
			return null;
		return haversineKm(lat1.doubleValue(), lon1.doubleValue(), lat2.doubleValue(), lon2.doubleValue());
	}

	/**
	 * 오버로드: 모두 BigDecimal (확장용)
	 */
	@SuppressWarnings("unused")
	private static Double haversineKm(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
		if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
			return null;
		return haversineKm(lat1.doubleValue(), lon1.doubleValue(), lat2.doubleValue(), lon2.doubleValue());
	}
}