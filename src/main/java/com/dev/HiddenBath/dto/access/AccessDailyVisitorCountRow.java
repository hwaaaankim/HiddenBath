package com.dev.HiddenBath.dto.access;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class AccessDailyVisitorCountRow {

    private final LocalDate visitDate;
    private final long visitorCount;

    public AccessDailyVisitorCountRow(LocalDate visitDate, long visitorCount) {
        this.visitDate = visitDate;
        this.visitorCount = visitorCount;
    }
}