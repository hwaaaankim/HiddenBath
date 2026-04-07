package com.dev.HiddenBath.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.dto.OnlineAgencyResponse;
import com.dev.HiddenBath.model.OnlineAgency;
import com.dev.HiddenBath.repository.OnlineAgencyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OnlineAgencyServiceImpl implements OnlineAgencyService {

    private final OnlineAgencyRepository repository;

    @Value("${spring.upload.path}")
    private String commonPath; // 예) /data/upload

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public OnlineAgencyResponse create(String name, String contact, String fax, String homepageUrl, MultipartFile logoFile) {
        // 1) 기본 정보 먼저 저장하여 ID 확보
        OnlineAgency saved = repository.save(
                OnlineAgency.builder()
                        .name(name)
                        .contact(contact)
                        .fax(fax)
                        .homepageUrl(homepageUrl)
                        .build()
        );

        // 2) 로고 파일 있으면 저장 후 경로 업데이트
        if (logoFile != null && !logoFile.isEmpty()) {
            storeAndBindLogo(saved, logoFile);
        }
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OnlineAgencyResponse> search(String type, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<OnlineAgency> result;

        String kw = (keyword == null) ? "" : keyword.trim();
        if (!StringUtils.hasText(type) || "name".equalsIgnoreCase(type)) {
            result = repository.findByNameContainingIgnoreCase(kw, pageable);
        } else if ("contact".equalsIgnoreCase(type)) {
            result = repository.findByContactContaining(kw, pageable);
        } else {
            result = repository.findAll(pageable);
        }
        return result.map(this::toResponse);
    }

    @Override
    public OnlineAgencyResponse update(Long id, String name, String contact, String fax, String homepageUrl,
                                       MultipartFile newLogoFile, boolean removeLogo) {
        OnlineAgency agency = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("대리점이 존재하지 않습니다. id=" + id));

        agency.setName(name);
        agency.setContact(contact);
        agency.setFax(fax);
        agency.setHomepageUrl(homepageUrl);

        // 로고 처리 우선순위:
        // 1) removeLogo=true 이면 기존 파일 삭제 및 null 셋
        // 2) removeLogo=false + 새 파일 있으면 기존 삭제 후 새로 저장
        if (removeLogo) {
            deleteExistingLogoIfAny(agency);
            agency.setLogoImagePath(null);
            agency.setLogoImageRoad(null);
        } else if (newLogoFile != null && !newLogoFile.isEmpty()) {
            deleteExistingLogoIfAny(agency);
            storeAndBindLogo(agency, newLogoFile);
        }

        return toResponse(agency);
    }

    @Override
    public void delete(Long id) {
        OnlineAgency agency = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("대리점이 존재하지 않습니다. id=" + id));

        // 전체 폴더(agencyId) 삭제
        Path baseDir = Paths.get(commonPath, "onlineAgency", String.valueOf(id));
        try {
            if (Files.exists(baseDir)) {
                deleteDirectoryRecursively(baseDir);
            }
        } catch (IOException e) {
            // 파일 삭제 실패해도 DB 삭제는 진행 (로그만 남김)
            e.printStackTrace();
        }

        repository.deleteById(id);
    }

    /* ================== 내부 유틸 ================== */

    private void storeAndBindLogo(OnlineAgency agency, MultipartFile file) {
        if (file == null || file.isEmpty()) return;
        if (file.getContentType() == null || !file.getContentType().toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }

        String dateStr = LocalDate.now().format(DATE_FMT);
        Path dir = Paths.get(commonPath, "onlineAgency", String.valueOf(agency.getId()), dateStr, "logo");
        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            throw new RuntimeException("로고 저장 디렉토리 생성 실패: " + dir, e);
        }

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null) {
            int idx = original.lastIndexOf('.');
            ext = (idx >= 0) ? original.substring(idx) : "";
        }
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path target = dir.resolve(filename);

        try {
            file.transferTo(target.toFile());
        } catch (IOException e) {
            throw new RuntimeException("로고 파일 저장 실패: " + target, e);
        }

        // 파일시스템 절대경로
        agency.setLogoImagePath(target.toAbsolutePath().toString());
        // 웹 접근 경로
        String webPath = "/administration/upload/onlineAgency/" + agency.getId() + "/" + dateStr + "/logo/" + filename;
        agency.setLogoImageRoad(webPath);
    }

    private void deleteExistingLogoIfAny(OnlineAgency agency) {
        if (StringUtils.hasText(agency.getLogoImagePath())) {
            try {
                Path p = Paths.get(agency.getLogoImagePath());
                Files.deleteIfExists(p);
            } catch (Exception e) {
                // 문제시 로그만
                e.printStackTrace();
            }
        }
    }

    private void deleteDirectoryRecursively(Path path) throws IOException {
        if (!Files.exists(path)) return;
        Files.walk(path)
                .sorted((a, b) -> b.compareTo(a)) // 하위부터 삭제
                .forEach(p -> {
                    try {
                        Files.deleteIfExists(p);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
    }

    private OnlineAgencyResponse toResponse(OnlineAgency a) {
        return OnlineAgencyResponse.builder()
                .id(a.getId())
                .name(a.getName())
                .contact(a.getContact())
                .fax(a.getFax())
                .homepageUrl(a.getHomepageUrl())
                .logoImagePath(a.getLogoImagePath())
                .logoImageRoad(a.getLogoImageRoad())
                .build();
    }
}
