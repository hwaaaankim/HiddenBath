package com.dev.HiddenBath.service.access;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.HiddenBath.model.access.SiteDailyVisitor;
import com.dev.HiddenBath.model.access.SitePageView;
import com.dev.HiddenBath.repository.access.SiteDailyVisitorRepository;
import com.dev.HiddenBath.repository.access.SitePageViewRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SiteAnalyticsService {

    private static final String VISITOR_COOKIE_NAME = "HB_VISITOR_ID";

    private final SiteDailyVisitorRepository siteDailyVisitorRepository;
    private final SitePageViewRepository sitePageViewRepository;

    @Transactional
    public void recordPageView(HttpServletRequest request, HttpServletResponse response) {
        LocalDate today = LocalDate.now();

        String visitorId = getOrCreateVisitorId(request, response);
        Long memberId = extractMemberId(request);

        saveDailyVisitorIfAbsent(today, visitorId, memberId, request);
        savePageView(today, visitorId, memberId, request);
    }

    private String getOrCreateVisitorId(HttpServletRequest request, HttpServletResponse response) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (VISITOR_COOKIE_NAME.equals(cookie.getName())
                        && cookie.getValue() != null
                        && !cookie.getValue().isBlank()) {
                    return cookie.getValue();
                }
            }
        }

        String visitorId = UUID.randomUUID().toString().replace("-", "");
        Cookie cookie = new Cookie(VISITOR_COOKIE_NAME, visitorId);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 365);
        response.addCookie(cookie);
        return visitorId;
    }

    private void saveDailyVisitorIfAbsent(LocalDate today,
                                          String visitorId,
                                          Long memberId,
                                          HttpServletRequest request) {

        boolean exists = siteDailyVisitorRepository.existsByVisitDateAndVisitorId(today, visitorId);
        if (exists) {
            return;
        }

        SiteDailyVisitor entity = SiteDailyVisitor.builder()
                .visitDate(today)
                .visitorId(visitorId)
                .memberId(memberId)
                .firstUri(request.getRequestURI())
                .firstReferer(request.getHeader("Referer"))
                .ipAddress(extractClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .build();

        siteDailyVisitorRepository.save(entity);
    }

    private void savePageView(LocalDate today,
                              String visitorId,
                              Long memberId,
                              HttpServletRequest request) {

        String queryString = request.getQueryString();
        String fullUrl = request.getRequestURI() + (queryString == null ? "" : "?" + queryString);

        SitePageView entity = SitePageView.builder()
                .visitDate(today)
                .visitorId(visitorId)
                .sessionId(request.getSession(false) != null ? request.getSession(false).getId() : null)
                .memberId(memberId)
                .uri(request.getRequestURI())
                .queryString(queryString)
                .fullUrl(fullUrl)
                .referer(request.getHeader("Referer"))
                .ipAddress(extractClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .build();

        sitePageViewRepository.save(entity);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private Long extractMemberId(HttpServletRequest request) {
        Object principal = request.getUserPrincipal();
        return null;
    }
}