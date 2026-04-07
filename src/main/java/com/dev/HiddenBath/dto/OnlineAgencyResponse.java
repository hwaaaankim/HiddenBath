package com.dev.HiddenBath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnlineAgencyResponse {
	private Long id;
	private String name;
	private String contact;
	private String fax;
	private String homepageUrl;
	private String logoImagePath; // 절대경로(관리용)
	private String logoImageRoad; // 웹경로(프론트 표시용)
}