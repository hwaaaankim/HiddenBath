package com.dev.HiddenBath.dto.access;

import lombok.Getter;

@Getter
public class AccessPageAggregateRow {

    private final String uri;
    private final long pageViewCount;
    private final long visitorCount;

    public AccessPageAggregateRow(String uri, long pageViewCount, long visitorCount) {
        this.uri = uri;
        this.pageViewCount = pageViewCount;
        this.visitorCount = visitorCount;
    }
}