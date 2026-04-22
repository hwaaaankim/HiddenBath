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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "site_daily_visitor",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_site_daily_visitor_date_visitor",
            columnNames = {"visit_date", "visitor_id"}
        )
    },
    indexes = {
        @Index(name = "idx_site_daily_visitor_date", columnList = "visit_date"),
        @Index(name = "idx_site_daily_visitor_member", columnList = "member_id"),
        @Index(name = "idx_site_daily_visitor_visitor", columnList = "visitor_id")
    }
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SiteDailyVisitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 방문 기준 일자
     */
    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    /**
     * 브라우저 식별용 방문자 쿠키 ID
     */
    @Column(name = "visitor_id", nullable = false, length = 64)
    private String visitorId;

    /**
     * 로그인 회원 ID (비회원이면 null)
     */
    @Column(name = "member_id")
    private Long memberId;

    /**
     * 해당 날짜 첫 진입 URI
     */
    @Column(name = "first_uri", length = 500)
    private String firstUri;

    /**
     * 첫 진입 referrer
     */
    @Column(name = "first_referer", length = 1000)
    private String firstReferer;

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

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.visitDate == null) {
            this.visitDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void changeMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public void changeFirstUri(String firstUri) {
        this.firstUri = firstUri;
    }

    public void changeFirstReferer(String firstReferer) {
        this.firstReferer = firstReferer;
    }

    public void changeIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public void changeUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}