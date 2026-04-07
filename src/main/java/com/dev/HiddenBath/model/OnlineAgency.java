package com.dev.HiddenBath.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "online_agency")
public class OnlineAgency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100) // 대리점명
    private String name;

    @Column(length = 50) // 연락처(하이픈 포함 문자열)
    private String contact;

    @Column(length = 50) // 팩스(하이픈 포함 문자열)
    private String fax;

    @Column(name = "homepage_url", length = 255) // 홈페이지 주소
    private String homepageUrl;

    // 파일시스템 실제 저장 경로 (절대경로)
    @Column(name = "logo_image_path", length = 500)
    private String logoImagePath;

    // 웹 접근 경로 (/administration/upload/onlineAgency/..../파일명)
    @Column(name = "logo_image_road", length = 500)
    private String logoImageRoad;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}