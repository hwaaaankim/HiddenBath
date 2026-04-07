package com.dev.HiddenBath.utils;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public final class KRegionNormalizer {

    private static final Map<String, Set<String>> PROVINCE_ALIASES = new HashMap<>();

    static {
        // 광역시/특별시/특별자치시/도 → 약칭 포함
        put("서울", "서울", "서울특별시");
        put("부산", "부산", "부산광역시");
        put("대구", "대구", "대구광역시");
        put("인천", "인천", "인천광역시");
        put("광주", "광주", "광주광역시");
        put("대전", "대전", "대전광역시");
        put("울산", "울산", "울산광역시");
        put("세종", "세종", "세종특별자치시", "세종시");
        put("경기", "경기", "경기도");
        put("강원", "강원", "강원도");
        put("충북", "충북", "충청북도");
        put("충남", "충남", "충청남도");
        put("전북", "전북", "전라북도");
        put("전남", "전남", "전라남도");
        put("경북", "경북", "경상북도");
        put("경남", "경남", "경상남도");
        put("제주", "제주", "제주특별자치도", "제주시"); // 일부 데이터가 '제주시'로 들어간 경우 방지
    }

    private static void put(String key, String... aliases) {
        Set<String> s = new HashSet<>();
        for (String a : aliases) {
            if (a != null) s.add(a.trim().toLowerCase());
        }
        PROVINCE_ALIASES.put(key.toLowerCase(), Collections.unmodifiableSet(s));
    }

    /** 입력된 시/도 명칭(경기도/경기 등)에 대해 DB 매칭 가능한 별칭 세트를 반환 */
    public static Set<String> aliasesForProvince(String input) {
        if (input == null || input.isBlank()) return Set.of();
        String norm = input.trim().toLowerCase();

        // 정확 매칭
        for (Set<String> s : PROVINCE_ALIASES.values()) {
            if (s.contains(norm)) return s;
        }

        // 접미사 제거(특별시/광역시/특별자치시/특별자치도/도)
        String stripped = norm
                .replace("특별자치시", "")
                .replace("특별자치도", "")
                .replace("광역시", "")
                .replace("특별시", "")
                .replace("자치시", "")
                .replace("자치도", "")
                .replace("도", "")
                .trim();

        if (!stripped.isEmpty()) {
            for (Map.Entry<String, Set<String>> e : PROVINCE_ALIASES.entrySet()) {
                if (e.getValue().contains(stripped)) return e.getValue();
            }
            // key가 약칭인 경우도 체크
            Set<String> shortSet = PROVINCE_ALIASES.get(stripped);
            if (shortSet != null) return shortSet;
        }

        // 미지정: 입력 그대로만 반환(하위 호환)
        return Set.of(norm);
    }

    private KRegionNormalizer() {}
}