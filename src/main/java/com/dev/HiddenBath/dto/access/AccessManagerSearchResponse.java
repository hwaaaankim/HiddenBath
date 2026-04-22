package com.dev.HiddenBath.dto.access;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessManagerSearchResponse {

    private String fromDate;
    private String toDate;
    private AccessManagerSummaryResponse summary;
    private List<AccessManagerDailyRowResponse> dailyStats;
    private List<AccessManagerTopPageResponse> topPages;
}