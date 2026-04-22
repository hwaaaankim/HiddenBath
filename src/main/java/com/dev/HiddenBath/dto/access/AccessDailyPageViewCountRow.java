package com.dev.HiddenBath.dto.access;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class AccessDailyPageViewCountRow {

    private final LocalDate visitDate;
    private final long pageViewCount;

    public AccessDailyPageViewCountRow(LocalDate visitDate, long pageViewCount) {
        this.visitDate = visitDate;
        this.pageViewCount = pageViewCount;
    }
}