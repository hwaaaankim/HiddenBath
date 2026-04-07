package com.dev.HiddenBath.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.model.Construction;
import com.dev.HiddenBath.repository.ConstructionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConstructionService {

    private final ConstructionRepository constructionRepository;

    @Value("${spring.upload.path}")
    private String commonPath;

    /** 신규 등록 */
    @Transactional
    public void insertConstruction(MultipartFile thumb, MultipartFile construction) throws IOException {
        if (thumb == null || thumb.isEmpty()) {
            throw new IllegalArgumentException("썸네일 파일이 비어 있습니다.");
        }
        if (construction == null || construction.isEmpty()) {
            throw new IllegalArgumentException("원본 이미지 파일이 비어 있습니다.");
        }

        final String dirPath = normalizeDir(commonPath) + "construction/";
        final String roadBase = "/administration/upload/construction/";
        makeDirs(dirPath);

        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 12);

        // 썸네일 저장
        String thumbExt = safeExt(thumb.getOriginalFilename());
        String thumbFilename = "thumb_" + random + thumbExt;
        Path thumbPath = Path.of(dirPath, thumbFilename);
        Files.copy(thumb.getInputStream(), thumbPath, StandardCopyOption.REPLACE_EXISTING);

        // 원본 저장
        String originExt = safeExt(construction.getOriginalFilename());
        String originFilename = random + originExt;
        Path originPath = Path.of(dirPath, originFilename);
        Files.copy(construction.getInputStream(), originPath, StandardCopyOption.REPLACE_EXISTING);

        Construction entity = new Construction();
        entity.setPath(originPath.toString());
        entity.setName(originFilename);
        entity.setRoad(roadBase + originFilename);

        entity.setThumbPath(thumbPath.toString());
        entity.setThumbName(thumbFilename);
        entity.setThumbRoad(roadBase + thumbFilename);

        constructionRepository.save(entity);
    }

    /** 이미지 교체 (썸네일/원본 중 하나만 변경해도 가능) */
    @Transactional
    public void updateConstructionImages(Long id, MultipartFile newThumb, MultipartFile newOrigin) throws IOException {
        Construction entity = constructionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시공사례 ID입니다. id=" + id));

        final String dirPath = normalizeDir(commonPath) + "construction/";
        final String roadBase = "/administration/upload/construction/";
        makeDirs(dirPath);

        // 썸네일 교체
        if (newThumb != null && !newThumb.isEmpty()) {
            deleteIfExists(entity.getThumbPath());

            String random = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
            String ext = safeExt(newThumb.getOriginalFilename());
            String newThumbFilename = "thumb_" + random + ext;

            Path newThumbPath = Path.of(dirPath, newThumbFilename);
            Files.copy(newThumb.getInputStream(), newThumbPath, StandardCopyOption.REPLACE_EXISTING);

            entity.setThumbPath(newThumbPath.toString());
            entity.setThumbName(newThumbFilename);
            entity.setThumbRoad(roadBase + newThumbFilename);
        }

        // 원본 교체
        if (newOrigin != null && !newOrigin.isEmpty()) {
            deleteIfExists(entity.getPath());

            String random = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
            String ext = safeExt(newOrigin.getOriginalFilename());
            String newOriginFilename = random + ext;

            Path newOriginPath = Path.of(dirPath, newOriginFilename);
            Files.copy(newOrigin.getInputStream(), newOriginPath, StandardCopyOption.REPLACE_EXISTING);

            entity.setPath(newOriginPath.toString());
            entity.setName(newOriginFilename);
            entity.setRoad(roadBase + newOriginFilename);
        }

        constructionRepository.save(entity);
    }

    /** 삭제 (DB + 실제 파일) */
    @Transactional
    public void deleteConstruction(Long id) {
        Construction entity = constructionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시공사례 ID입니다. id=" + id));

        deleteIfExists(entity.getPath());
        deleteIfExists(entity.getThumbPath());

        constructionRepository.delete(entity);
    }

    private void makeDirs(String dirPath) {
        File dir = new File(dirPath);
        if (!dir.exists()) dir.mkdirs();
    }

    private String normalizeDir(String base) {
        if (base == null) return "";
        return base.endsWith("/") ? base : base + "/";
    }

    private String safeExt(String filename) {
        if (filename == null) return "";
        int idx = filename.lastIndexOf('.');
        return (idx >= 0) ? filename.substring(idx) : "";
    }

    private void deleteIfExists(String filePath) {
        try {
            if (filePath != null && !filePath.isBlank()) {
                Files.deleteIfExists(Path.of(filePath));
            }
        } catch (IOException ex) {
            System.err.println("[WARN] 파일 삭제 실패: " + filePath + " / " + ex.getMessage());
        }
    }
}
