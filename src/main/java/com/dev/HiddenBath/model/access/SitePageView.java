package com.dev.HiddenBath.model.access;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "site_page_view",
    indexes = {
        @Index(name = "idx_site_page_view_date", columnList = "visit_date"),
        @Index(name = "idx_site_page_view_uri", columnList = "uri"),
        @Index(name = "idx_site_page_view_member", columnList = "member_id"),
        @Index(name = "idx_site_page_view_visitor_date", columnList = "visitor_id, visit_date"),
        @Index(name = "idx_site_page_view_viewed_at", columnList = "viewed_at")
    }
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SitePageView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 방문 기준 일자
     */
    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    /**
     * 실제 페이지 렌더링 시각
     */
    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt;

    /**
     * 브라우저 식별용 방문자 쿠키 ID
     */
    @Column(name = "visitor_id", nullable = false, length = 64)
    private String visitorId;

    /**
     * 현재 세션 ID
     */
    @Column(name = "session_id", length = 128)
    private String sessionId;

    /**
     * 로그인 회원 ID (비회원이면 null)
     */
    @Column(name = "member_id")
    private Long memberId;

    /**
     * URI 경로 예: /about
     */
    @Column(name = "uri", nullable = false, length = 500)
    private String uri;

    /**
     * QueryString 원문
     */
    @Column(name = "query_string", length = 1000)
    private String queryString;

    /**
     * URI + QueryString 조합
     */
    @Column(name = "full_url", nullable = false, length = 1500)
    private String fullUrl;

    /**
     * 유입 referrer
     */
    @Column(name = "referer", length = 1000)
    private String referer;

    /**
     * 접속 IP
     */
    @Column(name = "ip_address", length = 100)
    private String ipAddress;

    /**
     * user-agent 전체 문자열
     */
    @Column(name = "user_agent", length = 1000)
    private String userAgent;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (this.viewedAt == null) {
            this.viewedAt = now;
        }

        if (this.visitDate == null) {
            this.visitDate = this.viewedAt.toLocalDate();
        }
    }
}