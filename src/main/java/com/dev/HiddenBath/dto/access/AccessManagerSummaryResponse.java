package com.dev.HiddenBath.dto.access;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessManagerSummaryResponse {

    private long totalVisitors;
    private long totalPageViews;
    private double averagePageViewsPerVisitor;
    private int periodDays;
}