package com.dev.HiddenBath.dto.access;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccessManagerDailyPageSearchResponse {

    private String date;
    private List<AccessManagerTopPageResponse> pages;
}