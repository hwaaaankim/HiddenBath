package com.dev.HiddenBath.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class AgencyResponse {

    private final Long id;
    private final String name;

    // 로고
    private final String logoImagePath;
    private final String logoImageRoad;

    // 주소 원문
    private final String postcode;
    private final String roadAddress;
    private final String jibunAddress;
    private final String addressDetail;

    // 원문 시/군/구/법정동 (프론트 바인딩/검색 호환용)
    private final String sido;
    private final String sigungu;
    private final String bname;

    // 좌표
    private final BigDecimal latitude;
    private final BigDecimal longitude;

    // ★ 추가
    private final String fax;
    
    // 연락/링크/담당
    private final String tel;
    private final String mobile;
    private final String kakaoTalkLink;
    private final String staffName;

    // ===== 추가: 행정구역(FK) 식별/표시 =====
    private final Long provinceId;
    private final String provinceName;

    private final Long cityId;       // 서울 등에서는 null
    private final String cityName;

    private final Long districtId;
    private final String districtName;

    // 선택: 거리(km)
    private final Double distanceKm;

    @Builder
    public AgencyResponse(Long id,
                          String name,
                          String logoImagePath,
                          String logoImageRoad,
                          String postcode,
                          String roadAddress,
                          String jibunAddress,
                          String addressDetail,
                          String sido,
                          String sigungu,
                          String bname,
                          BigDecimal latitude,
                          BigDecimal longitude,
                          String tel,
                          String mobile,
                          String fax,
                          String kakaoTalkLink,
                          String staffName,
                          Long provinceId,
                          String provinceName,
                          Long cityId,
                          String cityName,
                          Long districtId,
                          String districtName,
                          Double distanceKm) {
        this.id = id;
        this.name = name;
        this.logoImagePath = logoImagePath;
        this.logoImageRoad = logoImageRoad;
        this.postcode = postcode;
        this.roadAddress = roadAddress;
        this.jibunAddress = jibunAddress;
        this.addressDetail = addressDetail;
        this.sido = sido;
        this.sigungu = sigungu;
        this.bname = bname;
        this.latitude = latitude;
        this.longitude = longitude;
        this.tel = tel;
        this.mobile = mobile;
        this.fax= fax;
        this.kakaoTalkLink = kakaoTalkLink;
        this.staffName = staffName;
        this.provinceId = provinceId;
        this.provinceName = provinceName;
        this.cityId = cityId;
        this.cityName = cityName;
        this.districtId = districtId;
        this.districtName = districtName;
        this.distanceKm = distanceKm;
    }
}