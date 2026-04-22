package com.dev.HiddenBath.dto.access;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessManagerPageLogResponse {

    private String viewedAt;
    private String referer;
    private String ipAddress;
    private String userAgent;
}