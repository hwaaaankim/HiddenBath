package com.dev.HiddenBath.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_agency", indexes = { @Index(name = "IX_TB_AGENCY__NAME", columnList = "AGENCY_NAME"),
		@Index(name = "IX_TB_AGENCY__TEL", columnList = "TEL"),
		@Index(name = "IX_TB_AGENCY__MOBILE", columnList = "MOBILE"),
		@Index(name = "IX_TB_AGENCY__FAX", columnList = "FAX"),
		@Index(name = "IX_TB_AGENCY__GEO", columnList = "LATITUDE,LONGITUDE"),
		@Index(name = "IX_TB_AGENCY__PROVINCE", columnList = "PROVINCE_ID"),
		@Index(name = "IX_TB_AGENCY__CITY", columnList = "CITY_ID"),
		@Index(name = "IX_TB_AGENCY__DISTRICT", columnList = "DISTRICT_ID") })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agency {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "AGENCY_ID")
	private Long id;

	@NotBlank
	@Size(max = 200)
	@Column(name = "AGENCY_NAME", nullable = false, length = 200)
	private String name;

	@Size(max = 500)
	@Column(name = "LOGO_IMAGE_PATH", length = 500)
	private String logoImagePath;

	@Size(max = 500)
	@Column(name = "LOGO_IMAGE_ROAD", length = 500)
	private String logoImageRoad;

	// ====== 원문 문자열 ======
	@Size(max = 10)
	@Column(name = "POSTCODE", length = 10)
	private String postcode;
	@Size(max = 300)
	@Column(name = "ROAD_ADDRESS", length = 300)
	private String roadAddress;
	@Size(max = 300)
	@Column(name = "JIBUN_ADDRESS", length = 300)
	private String jibunAddress;
	@Size(max = 200)
	@Column(name = "ADDRESS_DETAIL", length = 200)
	private String addressDetail;
	@Size(max = 50)
	@Column(name = "SIDO", length = 50)
	private String sido;
	@Size(max = 50)
	@Column(name = "SIGUNGU", length = 50)
	private String sigungu;
	@Size(max = 50)
	@Column(name = "BNAME", length = 50)
	private String bname;

	// ====== 좌표 ======
	@Column(name = "LATITUDE", precision = 10, scale = 7)
	private BigDecimal latitude;
	@Column(name = "LONGITUDE", precision = 10, scale = 7)
	private BigDecimal longitude;

	// ====== 연락/링크/담당 ======
	@Size(max = 30)
	@Column(name = "TEL", length = 30)
	private String tel;
	@Size(max = 30)
	@Column(name = "MOBILE", length = 30)
	private String mobile;

	// ★ 추가: 팩스번호
	@Size(max = 30)
	@Column(name = "FAX", length = 30)
	private String fax;

	@Size(max = 300)
	@Column(name = "KAKAO_TALK_LINK", length = 300)
	private String kakaoTalkLink;
	@Size(max = 100)
	@Column(name = "STAFF_NAME", length = 100)
	private String staffName;

	// ====== 행정구역(FK) ======
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PROVINCE_ID", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private Province province;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CITY_ID", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private City city;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "DISTRICT_ID", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	private District district;

	// 감사 필드
	@Column(name = "CREATED_AT", insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "UPDATED_AT", insertable = false, updatable = false)
	private LocalDateTime updatedAt;
}