package com.dev.HiddenBath.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class PageResponse<T> {
    private List<T> content;
    private int number;       // 현재 페이지(0-based)
    private int size;         // 페이지 사이즈
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
}