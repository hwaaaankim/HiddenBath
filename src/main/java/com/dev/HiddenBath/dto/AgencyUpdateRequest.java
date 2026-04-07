package com.dev.HiddenBath.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgencyUpdateRequest {

    @Size(max = 200)
    private String name;

    // 주소
    @Size(max = 10)
    private String postcode;
    @Size(max = 300)
    private String roadAddress;
    @Size(max = 300)
    private String jibunAddress;
    @Size(max = 200)
    private String addressDetail;
    @Size(max = 50)
    private String sido;
    @Size(max = 50)
    private String sigungu;
    @Size(max = 50)
    private String bname;

    // 좌표
    private BigDecimal latitude;
    private BigDecimal longitude;

    // 연락/링크/담당
    @Size(max = 30)
    private String tel;
    @Size(max = 30)
    private String mobile;
    @Size(max = 30)
    private String fax;
    @Size(max = 300)
    private String kakaoTalkLink;
    @Size(max = 100)
    private String staffName;
    
    // ★ 추가: FK ID (선택)
    private Long provinceId; 
    private Long cityId;     
    private Long districtId; 
}
