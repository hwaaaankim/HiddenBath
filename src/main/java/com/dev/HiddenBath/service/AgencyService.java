package com.dev.HiddenBath.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.dev.HiddenBath.dto.AgencyCreateRequest;
import com.dev.HiddenBath.dto.AgencyResponse;
import com.dev.HiddenBath.dto.AgencyUpdateRequest;
import com.dev.HiddenBath.model.Agency;
import com.dev.HiddenBath.model.City;
import com.dev.HiddenBath.model.District;
import com.dev.HiddenBath.model.Province;
import com.dev.HiddenBath.repository.AgencyRepository;
import com.dev.HiddenBath.repository.CityRepository;
import com.dev.HiddenBath.repository.DistrictRepository;
import com.dev.HiddenBath.repository.ProvinceRepository;
import com.dev.HiddenBath.utils.KRegionNormalizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgencyService {

	private final AgencyRepository agencyRepository;
	private final ProvinceRepository provinceRepository;
	private final CityRepository cityRepository;
	private final DistrictRepository districtRepository;

	@Value("${spring.upload.path}")
	private String uploadBasePath;

	private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	/* ======= 유틸 ======= */

	private static String sanitizeFileName(String original) {
		if (original == null)
			return null;
		String base = original.replace("\\", "/");
		base = base.substring(base.lastIndexOf('/') + 1);
		int dot = base.lastIndexOf('.');
		String ext = (dot > -1) ? base.substring(dot) : "";
		String name = (dot > -1) ? base.substring(0, dot) : base;
		name = name.replaceAll("[^A-Za-z0-9._-]", "_");
		return name + ext;
	}

	private static String randomizeFileName(String original) {
		String clean = sanitizeFileName(original);
		String ext = "";
		int dot = (clean == null) ? -1 : clean.lastIndexOf('.');
		if (dot > -1)
			ext = clean.substring(dot);
		return UUID.randomUUID().toString().replace("-", "") + ext;
	}

	private static void ensureDir(Path dir) throws IOException {
		if (!Files.exists(dir))
			Files.createDirectories(dir);
	}

	private static void safeDeleteFile(String filePath) {
		if (!StringUtils.hasText(filePath))
			return;
		try {
			Files.deleteIfExists(Paths.get(filePath));
		} catch (Exception ignore) {
		}
	}

	private static String norm(String s) {
		return (s == null) ? null : s.trim().replaceAll("\\s+", "").toLowerCase();
	}

	/* ======= 시/군/구 파싱 ======= */
	private static ParsedSigungu parseSigungu(String raw) {
		if (!StringUtils.hasText(raw))
			return new ParsedSigungu(null, null);
		String s = raw.trim().replaceAll("\\s+", " ");
		String[] parts = s.split("\\s+");

		String city = null;
		String district = null;

		// "용인시 수지구" 같은 케이스: 끝이 구, 앞쪽에 시/군
		if (parts.length >= 2 && parts[parts.length - 1].endsWith("구")) {
			for (int i = 0; i < parts.length - 1; i++) {
				if (parts[i].endsWith("시") || parts[i].endsWith("군")) {
					city = String.join("", Arrays.copyOfRange(parts, 0, i + 1)); // 공백 제거한 시/군
					district = parts[parts.length - 1];
					return new ParsedSigungu(city, district);
				}
			}
		}
		// 단일 "구" (예: 관악구)
		if (parts.length == 1 && parts[0].endsWith("구")) {
			district = parts[0];
			return new ParsedSigungu(null, district);
		}
		// 단일 "시/군" (예: 용인시/양평군)
		if (parts.length == 1 && (parts[0].endsWith("시") || parts[0].endsWith("군"))) {
			city = parts[0];
			return new ParsedSigungu(city, null);
		}
		// 보수적으로 원문(공백제거)을 city로 전달 (lookup 실패 시 예외)
		return new ParsedSigungu(s.replace(" ", ""), null);
	}

	private record ParsedSigungu(String city, String district) {
	}

	/* ======= KRegionNormalizer 사용: Province “엄격 연결” ======= */

	@Transactional(readOnly = true)
	protected RegionTriple resolveRegionsStrict(String rawSido, String rawSigungu) {
		if (!StringUtils.hasText(rawSido)) {
			return new RegionTriple(null, null, null); // 주소 비어있으면 연결 안 함
		}

		// 1) Province 별칭 세트 생성 (소문자)
		Set<String> aliases = KRegionNormalizer.aliasesForProvince(rawSido); // 이미 소문자/trim
		if (aliases.isEmpty()) {
			throw new IllegalArgumentException("등록되지 않은 시/도입니다: " + rawSido);
		}
		// 공백 제거/소문자 버전으로 변환
		Set<String> normalized = new LinkedHashSet<>();
		for (String a : aliases)
			normalized.add(norm(a));

		// DB 조회 (정규화 비교)
		Province province = provinceRepository.findFirstByNameInNormalized(normalized).orElseThrow(
				() -> new IllegalArgumentException("등록되지 않은 시/도입니다: " + rawSido + " (aliases: " + aliases + ")"));

		// 2) 시/군/구 파싱
		ParsedSigungu ps = parseSigungu(rawSigungu);
		City city = null;
		District district = null;

		// (A) city만 있는 경우 → 시만 연결 (없으면 예외)
		if (ps.city() != null && ps.district() == null) {
			city = cityRepository.findByNameNormalizedAndProvinceId(ps.city(), province.getId())
					.orElseThrow(() -> new IllegalArgumentException(
							"해당 시/도에 등록되지 않은 시/군입니다: " + ps.city() + " / " + province.getName()));
			return new RegionTriple(province, city, null);
		}

		// (B) district만 있는 경우 (서울/세종 등) → Province 기준 구 조회 (없으면 예외)
		if (ps.city() == null && ps.district() != null) {
			district = districtRepository.findByNameNormalizedAndProvinceId(ps.district(), province.getId())
					.orElseThrow(() -> new IllegalArgumentException(
							"해당 시/도에 등록되지 않은 구입니다: " + ps.district() + " / " + province.getName()));
			return new RegionTriple(province, null, district);
		}

		// (C) city+district 모두 있는 경우 → 시 조회 → 해당 시 기준 구 조회 (없으면 예외)
		if (ps.city() != null && ps.district() != null) {
			// city는 final 로컬 변수로 확정
			final City foundCity = cityRepository.findByNameNormalizedAndProvinceId(ps.city(), province.getId())
					.orElseThrow(() -> new IllegalArgumentException(
							"해당 시/도에 등록되지 않은 시입니다: " + ps.city() + " / " + province.getName()));

			// 람다에서 참조할 값들도 미리 final 로 뽑아둠
			final Long cityId = foundCity.getId();
			final String cityNameForMsg = foundCity.getName();

			final District foundDistrict = districtRepository.findByNameNormalizedAndCityId(ps.district(), cityId)
					.orElseThrow(() -> new IllegalArgumentException(
							"해당 시에 등록되지 않은 구입니다: " + ps.district() + " / " + cityNameForMsg));

			return new RegionTriple(province, foundCity, foundDistrict);
		}

		// (D) 시/구 모두 해석 불가 → 일단 Province만 연결
		return new RegionTriple(province, null, null);
	}

	private record RegionTriple(Province province, City city, District district) {
	}

	/* ======= DTO 변환 ======= */
	private static AgencyResponse toResponse(Agency a) {
		return AgencyResponse.builder().id(a.getId()).name(a.getName()).logoImagePath(a.getLogoImagePath())
				.logoImageRoad(a.getLogoImageRoad()).postcode(a.getPostcode()).roadAddress(a.getRoadAddress())
				.jibunAddress(a.getJibunAddress()).addressDetail(a.getAddressDetail()).sido(a.getSido())
				.sigungu(a.getSigungu()).bname(a.getBname()).latitude(a.getLatitude()).longitude(a.getLongitude())
				.tel(a.getTel()).mobile(a.getMobile()).fax(a.getFax()) // ★ 추가: 응답에 팩스 포함
				.kakaoTalkLink(a.getKakaoTalkLink()).staffName(a.getStaffName())
				.provinceName(a.getProvince() != null ? a.getProvince().getName() : null)
				.cityName(a.getCity() != null ? a.getCity().getName() : null)
				.districtName(a.getDistrict() != null ? a.getDistrict().getName() : null).build();
	}

	/* ======= CRUD ======= */
	@Transactional
	public AgencyResponse create(AgencyCreateRequest req, org.springframework.web.multipart.MultipartFile icon)
			throws IOException {
		Agency a = new Agency();
		a.setName(req.getName());

		// 원문 보존
		a.setPostcode(req.getPostcode());
		a.setRoadAddress(req.getRoadAddress());
		a.setJibunAddress(req.getJibunAddress());
		a.setAddressDetail(req.getAddressDetail());
		a.setSido(req.getSido());
		a.setSigungu(req.getSigungu());
		a.setBname(req.getBname());

		a.setLatitude(req.getLatitude() == null ? null : new BigDecimal(req.getLatitude().toPlainString()));
		a.setLongitude(req.getLongitude() == null ? null : new BigDecimal(req.getLongitude().toPlainString()));

		a.setTel(req.getTel());
		a.setMobile(req.getMobile());
		a.setFax(req.getFax()); // ★ 추가: 생성 시 팩스 저장
		a.setKakaoTalkLink(req.getKakaoTalkLink());
		a.setStaffName(req.getStaffName());

		// 1차 저장
		Agency saved = agencyRepository.save(a);

		// 엄격 연결: 존재하는 행정구역만 FK 세팅 (없으면 즉시 예외)
		RegionTriple rt = resolveRegionsStrict(req.getSido(), req.getSigungu());
		saved.setProvince(rt.province());
		saved.setCity(rt.city());
		saved.setDistrict(rt.district());

		// 아이콘 파일(선택)
		if (icon != null && !icon.isEmpty()) {
			String date = LocalDate.now().format(FMT);
			String fileName = randomizeFileName(Objects.requireNonNull(icon.getOriginalFilename()));
			Path dir = Paths.get(uploadBasePath, "agency", String.valueOf(saved.getId()), "icon", date);
			ensureDir(dir);
			Path target = dir.resolve(fileName);
			Files.copy(icon.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

			String road = "/administration/upload/agency/" + saved.getId() + "/icon/" + date + "/" + fileName;
			saved.setLogoImagePath(target.toAbsolutePath().toString());
			saved.setLogoImageRoad(road);
		}

		return toResponse(saved);
	}

	@Transactional
	public AgencyResponse update(Long id, AgencyUpdateRequest req, org.springframework.web.multipart.MultipartFile icon)
			throws IOException {
		Agency a = agencyRepository.findWithRegionsById(id)
				.orElseThrow(() -> new IllegalArgumentException("대리점 없음: " + id));

		// 1) 스칼라 필드
		if (req.getName() != null)
			a.setName(req.getName());
		if (req.getPostcode() != null)
			a.setPostcode(req.getPostcode());
		if (req.getRoadAddress() != null)
			a.setRoadAddress(req.getRoadAddress());
		if (req.getJibunAddress() != null)
			a.setJibunAddress(req.getJibunAddress());
		if (req.getAddressDetail() != null)
			a.setAddressDetail(req.getAddressDetail());
		if (req.getSido() != null)
			a.setSido(req.getSido());
		if (req.getSigungu() != null)
			a.setSigungu(req.getSigungu());
		if (req.getBname() != null)
			a.setBname(req.getBname());

		if (req.getLatitude() != null)
			a.setLatitude(new BigDecimal(req.getLatitude().toPlainString()));
		if (req.getLongitude() != null)
			a.setLongitude(new BigDecimal(req.getLongitude().toPlainString()));

		if (req.getTel() != null)
			a.setTel(req.getTel());
		if (req.getMobile() != null)
			a.setMobile(req.getMobile());
		if (req.getFax() != null)
			a.setFax(req.getFax()); // ★ 추가: 수정 시 팩스 반영
		if (req.getKakaoTalkLink() != null)
			a.setKakaoTalkLink(req.getKakaoTalkLink());
		if (req.getStaffName() != null)
			a.setStaffName(req.getStaffName());

		// 2) FK 재연결
		boolean anyIdProvided = (req.getProvinceId() != null || req.getCityId() != null || req.getDistrictId() != null);
		if (anyIdProvided) {
			Province newProvince = null;
			City newCity = null;
			District newDistrict = null;

			// 개별 조회
			if (req.getProvinceId() != null) {
				newProvince = provinceRepository.findById(req.getProvinceId())
						.orElseThrow(() -> new IllegalArgumentException("Province 없음: " + req.getProvinceId()));
			}
			if (req.getCityId() != null) {
				newCity = cityRepository.findById(req.getCityId())
						.orElseThrow(() -> new IllegalArgumentException("City 없음: " + req.getCityId()));
			}
			if (req.getDistrictId() != null) {
				newDistrict = districtRepository.findById(req.getDistrictId())
						.orElseThrow(() -> new IllegalArgumentException("District 없음: " + req.getDistrictId()));
			}

			// 하위에서 상위 보정: District → City/Province
			if (newDistrict != null) {
				if (newDistrict.getCity() != null) {
					// 시 소속 구
					City dCity = newDistrict.getCity();
					Province dProv = dCity.getProvince();
					if (newCity == null)
						newCity = dCity;
					if (newProvince == null)
						newProvince = dProv;

					// 불일치 검증
					if (!Objects.equals(newCity.getId(), dCity.getId())) {
						throw new IllegalArgumentException("District가 지시하는 City와 전달된 City 불일치");
					}
					if (!Objects.equals(newProvince.getId(), dProv.getId())) {
						throw new IllegalArgumentException("District가 지시하는 Province와 전달된 Province 불일치");
					}
				} else {
					// Province 직속 구(서울/세종 등)
					Province dProv = newDistrict.getProvince();
					if (dProv == null) {
						throw new IllegalStateException("District에 Province/City 정보가 없습니다.");
					}
					if (newProvince == null)
						newProvince = dProv;
					// City는 null이어야 함
					if (newCity != null) {
						throw new IllegalArgumentException("해당 District는 City가 없는 형태입니다(직할구). City를 함께 보낼 수 없습니다.");
					}
					// Province 불일치 검증
					if (!Objects.equals(newProvince.getId(), dProv.getId())) {
						throw new IllegalArgumentException("District가 지시하는 Province와 전달된 Province 불일치");
					}
				}
			}

			// City → Province 보정
			if (newCity != null) {
				Province cProv = newCity.getProvince();
				if (cProv == null) {
					throw new IllegalStateException("City에 Province가 없습니다.");
				}
				if (newProvince == null)
					newProvince = cProv;
				if (!Objects.equals(newProvince.getId(), cProv.getId())) {
					throw new IllegalArgumentException("City가 속한 Province와 전달된 Province 불일치");
				}

				// 기존 District가 있었고, 그 District가 이 City 소속이 아니라면 District 제거
				if (newDistrict == null && a.getDistrict() != null) {
					District oldD = a.getDistrict();
					if (oldD.getCity() != null) {
						if (!Objects.equals(oldD.getCity().getId(), newCity.getId())) {
							// 다른 시의 구였음 → 해제
							a.setDistrict(null);
						}
					} else {
						// 직속구였는데 City가 지정되었으므로 해제
						a.setDistrict(null);
					}
				}
			}

			// Province만 지정된 경우: City/District 정합성 정리
			if (newProvince != null && newCity == null && newDistrict == null) {
				// 기존 City/District가 새 Province에 속하지 않으면 해제
				if (a.getCity() != null && !Objects.equals(a.getCity().getProvince().getId(), newProvince.getId())) {
					a.setCity(null);
				}
				if (a.getDistrict() != null) {
					District od = a.getDistrict();
					boolean ok = ((od.getCity() != null
							&& Objects.equals(od.getCity().getProvince().getId(), newProvince.getId()))
							|| (od.getCity() == null && Objects.equals(od.getProvince().getId(), newProvince.getId())));
					if (!ok)
						a.setDistrict(null);
				}
			}

			// 최종 세팅
			a.setProvince(newProvince != null ? newProvince : a.getProvince());
			a.setCity(newCity != null ? newCity : a.getCity());
			a.setDistrict(newDistrict != null ? newDistrict : a.getDistrict());

		} else if (req.getSido() != null || req.getSigungu() != null) {
			// ID 미지정 + 문자열 변경 → Normalizer 기반 재연결
			String refSido = (req.getSido() != null) ? req.getSido() : a.getSido();
			String refSigungu = (req.getSigungu() != null) ? req.getSigungu() : a.getSigungu();
			RegionTriple rt = resolveRegionsStrict(refSido, refSigungu);
			a.setProvince(rt.province());
			a.setCity(rt.city());
			a.setDistrict(rt.district());
		}
		// else: 주소 관련 변화 없음 → 기존 FK 유지

		// 3) 아이콘 파일
		if (icon != null && !icon.isEmpty()) {
			safeDeleteFile(a.getLogoImagePath());
			String date = LocalDate.now().format(FMT);
			String fileName = randomizeFileName(Objects.requireNonNull(icon.getOriginalFilename()));
			Path dir = Paths.get(uploadBasePath, "agency", String.valueOf(a.getId()), "icon", date);
			ensureDir(dir);
			Path target = dir.resolve(fileName);
			Files.copy(icon.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

			String road = "/administration/upload/agency/" + a.getId() + "/icon/" + date + "/" + fileName;
			a.setLogoImagePath(target.toAbsolutePath().toString());
			a.setLogoImageRoad(road);
		}

		return toResponse(a);
	}

	@Transactional(readOnly = true)
	public org.springframework.data.domain.Page<AgencyResponse> search(String type, String keyword,
			org.springframework.data.domain.Pageable pageable) {
		var page = agencyRepository.searchByTypeAndKeyword(type, keyword, pageable);
		return page.map(AgencyService::toResponse);
	}

	@Transactional(readOnly = true)
	public AgencyResponse get(Long id) {
		Agency a = agencyRepository.findWithRegionsById(id)
				.orElseThrow(() -> new IllegalArgumentException("대리점 없음: " + id));
		return toResponse(a);
	}

	@Transactional
	public void delete(Long id) {
		Agency a = agencyRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("대리점 없음: " + id));
		safeDeleteFile(a.getLogoImagePath());
		agencyRepository.delete(a);
	}
}
