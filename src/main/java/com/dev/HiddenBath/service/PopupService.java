package com.dev.HiddenBath.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.model.Popup;
import com.dev.HiddenBath.repository.PopupRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PopupService {

	private final PopupRepository popupRepository;

	/** 실제 저장 루트 (예: /var/www/uploads) */
	@Value("${spring.upload.path}")
	private String uploadPath;

	/** 브라우저 접근 URL prefix (WebMvcConfig의 handler와 일치해야 함) */
	private static final String URL_BASE = "/administration/upload";

	private static final DateTimeFormatter FOLDER_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

	public List<Popup> listAll() {
		return popupRepository.findAllByOrderByCreatedAtDesc();
	}

	public List<Popup> findActivePopups(LocalDate today) {
		return popupRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByCreatedAtDesc(today, today);
	}

	public Popup create(MultipartFile image, LocalDate startDate, LocalDate endDate) {
		if (image == null || image.isEmpty()) {
			throw new IllegalArgumentException("이미지 파일은 필수입니다.");
		}
		validateDates(startDate, endDate);

		// 1) ID 확보
		Popup temp = Popup.builder().imagePath("").imageUrl("").startDate(startDate).endDate(endDate).build();
		temp = popupRepository.save(temp);

		// 2) 파일 저장
		String dateFolder = LocalDate.now().format(FOLDER_FMT);
		String ext = getExtension(Objects.requireNonNull(image.getOriginalFilename()));
		String filename = UUID.randomUUID() + "." + ext;

		// 실제 저장 경로: {uploadPath}/popup/{id}/{yyyy-MM-dd}/{filename}
		Path dir = Paths.get(uploadPath, "popup", String.valueOf(temp.getId()), dateFolder);
		Path filePath = dir.resolve(filename);
		try {
			Files.createDirectories(dir);
			Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new RuntimeException("이미지 저장 실패", e);
		}

		// 접근 URL: /administration/upload/popup/{id}/{yyyy-MM-dd}/{filename}
		String url = URL_BASE + "/popup/" + temp.getId() + "/" + dateFolder + "/" + filename;

		temp.setImagePath(filePath.toString());
		temp.setImageUrl(url);
		return temp;
	}

	public Popup update(Long id, MultipartFile image, LocalDate startDate, LocalDate endDate) {
		Popup popup = popupRepository.findById(id).orElseThrow(() -> new NoSuchElementException("팝업이 존재하지 않습니다."));
		validateDates(startDate, endDate);

		popup.setStartDate(startDate);
		popup.setEndDate(endDate);

		if (image != null && !image.isEmpty()) {
			// 기존 파일 삭제
			safeDelete(popup.getImagePath());

			String dateFolder = LocalDate.now().format(FOLDER_FMT);
			String ext = getExtension(Objects.requireNonNull(image.getOriginalFilename()));
			String filename = UUID.randomUUID() + "." + ext;

			Path dir = Paths.get(uploadPath, "popup", String.valueOf(popup.getId()), dateFolder);
			Path filePath = dir.resolve(filename);
			try {
				Files.createDirectories(dir);
				Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException e) {
				throw new RuntimeException("이미지 저장 실패", e);
			}

			String url = URL_BASE + "/popup/" + popup.getId() + "/" + dateFolder + "/" + filename;
			popup.setImagePath(filePath.toString());
			popup.setImageUrl(url);
		}

		return popup;
	}

	public void delete(Long id) {
		Popup popup = popupRepository.findById(id).orElseThrow(() -> new NoSuchElementException("팝업이 존재하지 않습니다."));
		safeDelete(popup.getImagePath());

		// 상위 폴더 비우기(선택)
		try {
			Path parent = Paths.get(popup.getImagePath()).getParent();
			if (parent != null && Files.exists(parent) && isEmptyDir(parent)) {
				Files.delete(parent);
			}
		} catch (Exception ignored) {
		}

		popupRepository.delete(popup);
	}

	private void validateDates(LocalDate start, LocalDate end) {
		if (start == null || end == null)
			throw new IllegalArgumentException("시작일/종료일은 필수입니다.");
		if (end.isBefore(start))
			throw new IllegalArgumentException("종료일은 시작일보다 빠를 수 없습니다.");
	}

	private String getExtension(String original) {
		String ext = StringUtils.getFilenameExtension(original);
		if (ext == null)
			throw new IllegalArgumentException("확장자를 확인할 수 없습니다.");
		String lower = ext.toLowerCase();
		if (!List.of("jpg", "jpeg", "png", "webp", "gif").contains(lower)) {
			throw new IllegalArgumentException("허용되지 않은 확장자입니다: " + lower);
		}
		return lower;
	}

	private void safeDelete(String path) {
		if (path == null || path.isBlank())
			return;
		try {
			Path p = Paths.get(path);
			if (Files.exists(p))
				Files.delete(p);
		} catch (Exception ignored) {
		}
	}

	private boolean isEmptyDir(Path dir) throws IOException {
		try (var s = Files.list(dir)) {
			return s.findAny().isEmpty();
		}
	}
}