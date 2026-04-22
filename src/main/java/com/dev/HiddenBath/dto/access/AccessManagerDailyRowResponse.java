package com.dev.HiddenBath.dto.access;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessManagerDailyRowResponse {

    private String date;
    private long visitorCount;
    private long pageViewCount;
    private double pageViewsPerVisitor;
}