package com.dev.HiddenBath.dto.access;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessManagerTopPageResponse {

    private String uri;
    private long pageViewCount;
    private long visitorCount;
}