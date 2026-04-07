package com.dev.HiddenBath.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.model.Gallery;
import com.dev.HiddenBath.repository.GalleryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GalleryService {

	private final GalleryRepository galleryRepository;

	@Value("${spring.upload.path}")
	private String commonPath;

	@Transactional
	public void insertGallery(MultipartFile thumb, MultipartFile gallery) throws IOException {
		if (thumb == null || thumb.isEmpty()) {
			throw new IllegalArgumentException("썸네일 파일이 비어 있습니다.");
		}
		if (gallery == null || gallery.isEmpty()) {
			throw new IllegalArgumentException("원본 이미지 파일이 비어 있습니다.");
		}

		final String dirPath = normalizeDir(commonPath) + "gallery/";
		final String roadBase = "/administration/upload/gallery/";

		makeDirs(dirPath);

		String random = UUID.randomUUID().toString().replace("-", "").substring(0, 12);

		// 썸네일 저장
		String thumbExt = safeExt(thumb.getOriginalFilename());
		String thumbFilename = "thumb_" + random + thumbExt;
		Path thumbPath = Path.of(dirPath, thumbFilename);
		Files.copy(thumb.getInputStream(), thumbPath, StandardCopyOption.REPLACE_EXISTING);

		// 원본 저장
		String originExt = safeExt(gallery.getOriginalFilename());
		String originFilename = random + originExt;
		Path originPath = Path.of(dirPath, originFilename);
		Files.copy(gallery.getInputStream(), originPath, StandardCopyOption.REPLACE_EXISTING);

		Gallery entity = new Gallery();
		entity.setPath(originPath.toString());
		entity.setName(originFilename);
		entity.setRoad(roadBase + originFilename);

		entity.setThumbPath(thumbPath.toString());
		entity.setThumbName(thumbFilename);
		entity.setThumbRoad(roadBase + thumbFilename);

		galleryRepository.save(entity);
	}

	@Transactional
	public void updateGalleryImages(Long id, MultipartFile newThumb, MultipartFile newOrigin) throws IOException {
		Gallery entity = galleryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 갤러리 ID입니다. id=" + id));

		final String dirPath = normalizeDir(commonPath) + "gallery/";
		final String roadBase = "/administration/upload/gallery/";
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

		galleryRepository.save(entity);
	}

	/**
	 * 갤러리 삭제: DB 레코드 및 실제 파일(원본/썸네일) 모두 삭제
	 */
	@Transactional
	public void deleteGallery(Long id) {
		Gallery entity = galleryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 갤러리 ID입니다. id=" + id));
		System.out.println(id);
		// 파일 선삭제 (실패하더라도 DB는 삭제)
		deleteIfExists(entity.getPath());
		deleteIfExists(entity.getThumbPath());

		galleryRepository.delete(entity);
	}

	private void makeDirs(String dirPath) {
		File dir = new File(dirPath);
		if (!dir.exists())
			dir.mkdirs();
	}

	private String normalizeDir(String base) {
		if (base == null)
			return "";
		return base.endsWith("/") ? base : base + "/";
	}

	private String safeExt(String filename) {
		if (filename == null)
			return "";
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

	public List<List<Gallery>> getGalleriesInTwoHalves() {
		List<Gallery> allGalleries = galleryRepository.findAll();
		int totalGalleries = allGalleries.size();
		int halfSize = totalGalleries / 2;
		List<Gallery> firstHalf = new ArrayList<>(allGalleries.subList(0, halfSize));
		List<Gallery> secondHalf = new ArrayList<>(allGalleries.subList(halfSize, totalGalleries));
		List<List<Gallery>> splitGalleries = new ArrayList<>();
		splitGalleries.add(firstHalf);
		splitGalleries.add(secondHalf);
		return splitGalleries;
	}
}
