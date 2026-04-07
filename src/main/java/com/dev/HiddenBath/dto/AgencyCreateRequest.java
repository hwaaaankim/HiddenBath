package com.dev.HiddenBath.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgencyCreateRequest {

    @NotBlank
    @Size(max = 200)
    private String name;

    // 주소
    @Size(max = 10)
    private String postcode;        // zonecode
    @Size(max = 300)
    private String roadAddress;     // roadAddress
    @Size(max = 300)
    private String jibunAddress;    // jibunAddress
    @Size(max = 200)
    private String addressDetail;   // 상세주소
    @Size(max = 50)
    private String sido;
    @Size(max = 50)
    private String sigungu;
    @Size(max = 50)
    private String bname;

    // 좌표 (클라이언트가 카카오 지오코딩으로 전달)
    private BigDecimal latitude;
    private BigDecimal longitude;

    // ★ 추가
    @Size(max = 30)
    private String fax;
    
    // 연락/링크/담당
    @Size(max = 30)
    private String tel;
    @Size(max = 30)
    private String mobile;
    @Size(max = 300)
    private String kakaoTalkLink;
    @Size(max = 100)
    private String staffName;
}
