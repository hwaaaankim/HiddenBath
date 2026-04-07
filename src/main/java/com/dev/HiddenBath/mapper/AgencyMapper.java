package com.dev.HiddenBath.mapper;

import org.hibernate.proxy.HibernateProxy;

import com.dev.HiddenBath.dto.AgencyResponse;
import com.dev.HiddenBath.model.Agency;

public final class AgencyMapper {

    private AgencyMapper() {}

    public static AgencyResponse toResponse(Agency a, Double distanceKm) {
        Long provinceId = safeId(a.getProvince());
        Long cityId     = safeId(a.getCity());
        Long districtId = safeId(a.getDistrict());

        String provinceName = nullSafeTrim(a.getSido());
        String cityName     = nullSafeTrim(a.getSigungu());
        String districtName = nullSafeTrim(a.getBname());

        return AgencyResponse.builder()
                .id(a.getId())
                .name(a.getName())
                .logoImagePath(a.getLogoImagePath())
                .logoImageRoad(a.getLogoImageRoad())
                .postcode(a.getPostcode())
                .roadAddress(a.getRoadAddress())
                .jibunAddress(a.getJibunAddress())
                .addressDetail(a.getAddressDetail())
                .sido(a.getSido())
                .sigungu(a.getSigungu())
                .bname(a.getBname())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .tel(a.getTel())
                .fax(a.getFax())    
                .mobile(a.getMobile())
                .kakaoTalkLink(a.getKakaoTalkLink())
                .staffName(a.getStaffName())
                .provinceId(provinceId)
                .provinceName(provinceName)
                .cityId(cityId)
                .cityName(cityName)
                .districtId(districtId)
                .districtName(districtName)
                .distanceKm(distanceKm)
                .build();
    }

    /** 프록시 초기화 없이 식별자만 안전 추출 (DB 조회 트리거 안 함) */
    private static Long safeId(Object assoc) {
        if (assoc == null) return null;

        // 1) Hibernate 프록시인 경우: LazyInitializer에서 식별자 직접 획득 (초기화 X)
        if (assoc instanceof HibernateProxy proxy) {
            Object id = proxy.getHibernateLazyInitializer().getIdentifier();
            return (id instanceof Long) ? (Long) id : null;
        }

        // 2) 실제 엔티티가 이미 로드된 경우: getId() 리플렉션 (초기화 이미 되어있음)
        try {
            var m = assoc.getClass().getMethod("getId");
            m.setAccessible(true);
            Object id = m.invoke(assoc);
            return (id instanceof Long) ? (Long) id : null;
        } catch (Throwable ignore) {
            return null;
        }
    }

    private static String nullSafeTrim(String s) {
        return (s == null) ? null : s.trim();
    }
}