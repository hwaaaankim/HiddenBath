package com.dev.HiddenBath.dto.access;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class AccessPageLogRow {

    private final LocalDateTime viewedAt;
    private final String uri;
    private final String referer;
    private final String ipAddress;
    private final String userAgent;

    public AccessPageLogRow(LocalDateTime viewedAt,
                            String uri,
                            String referer,
                            String ipAddress,
                            String userAgent) {
        this.viewedAt = viewedAt;
        this.uri = uri;
        this.referer = referer;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }
}