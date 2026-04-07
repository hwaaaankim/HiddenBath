package com.dev.HiddenBath.service.product;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.dto.ProductDTO;
import com.dev.HiddenBath.model.product.BigSort;
import com.dev.HiddenBath.model.product.MiddleSort;
import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.model.product.ProductColor;
import com.dev.HiddenBath.model.product.ProductFile;
import com.dev.HiddenBath.model.product.ProductImage;
import com.dev.HiddenBath.model.product.ProductOption;
import com.dev.HiddenBath.model.product.ProductSize;
import com.dev.HiddenBath.model.product.ProductTag;
import com.dev.HiddenBath.repository.product.ProductBigSortRepository;
import com.dev.HiddenBath.repository.product.ProductColorRepository;
import com.dev.HiddenBath.repository.product.ProductMiddleSortRepository;
import com.dev.HiddenBath.repository.product.ProductOptionRepository;
import com.dev.HiddenBath.repository.product.ProductRepository;
import com.dev.HiddenBath.repository.product.ProductSizeRepository;
import com.dev.HiddenBath.repository.product.ProductTagRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final ProductMiddleSortRepository productMiddleSortRepository;
	private final ProductBigSortRepository productBigSortRepository;
	private final ProductTagRepository productTagRepository;
	private final ProductOptionRepository productOptionRepository;
	private final ProductSizeRepository productSizeRepository;
	private final ProductColorRepository productColorRepository;

	@Value("${spring.upload.env}")
	private String env;

	@Value("${spring.upload.path}")
	private String commonPath;

	@Transactional
	public void exchangeProductIndexes(List<Long> oldIdList, List<Long> newIdList) {
		if (oldIdList == null || newIdList == null || oldIdList.size() != newIdList.size())
			throw new IllegalArgumentException("리스트 사이즈 불일치");

		// 기존 index값을 oldIdList 순서대로 추출
		List<Product> oldProducts = productRepository.findAllById(oldIdList);
		Map<Long, Integer> oldIndexMap = new HashMap<>();
		for (Product p : oldProducts) {
			oldIndexMap.put(p.getId(), p.getProductIndex());
		}

		// newIdList 순서대로 oldIdList에서 꺼낸 index값을 할당 (진짜 swap)
		List<Product> productsToSave = productRepository.findAllById(newIdList);
		for (int i = 0; i < newIdList.size(); i++) {
			Long id = newIdList.get(i);
			Product p = productsToSave.stream().filter(prod -> prod.getId().equals(id)).findFirst()
					.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 제품: " + id));
			p.setProductIndex(oldIndexMap.get(oldIdList.get(i))); // swap
		}
		productRepository.saveAll(productsToSave);
	}

	@Transactional
	public void updateProduct(Long productId, String name, String code, String title, String subject, Long bigSortId,
			Long middleSortId, Boolean order, Boolean handle, List<Long> sizeIds, List<Long> colorIds,
			List<Long> optionIds, List<Long> tagIds, MultipartFile productImage, List<MultipartFile> slideImages,
			MultipartFile drawingImage, Boolean deleteRepImage, Boolean deleteDrawingImage, String deleteSlideImageIds)
			throws IOException {
		// 1. 엔티티 조회
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다: " + productId));

		// 2. 기본 정보
		product.setName(name);
		product.setProductCode(code);
		product.setTitle(title != null && !title.trim().isEmpty() ? title : "-");
		product.setSubject(subject != null && !subject.trim().isEmpty() ? subject : "-");
		product.setOrder(order);
		product.setHandle(handle);

		// 3. 분류(대/중분류)
		if (bigSortId != null) {
			BigSort bigSort = productBigSortRepository.findById(bigSortId)
					.orElseThrow(() -> new IllegalArgumentException("대분류 없음: " + bigSortId));
			product.setBigSort(bigSort);
		}
		if (middleSortId != null) {
			MiddleSort middleSort = productMiddleSortRepository.findById(middleSortId)
					.orElseThrow(() -> new IllegalArgumentException("중분류 없음: " + middleSortId));
			product.setMiddleSort(middleSort);
		}

		// 4. 연관관계(옵션/사이즈/색상/태그) 모두 clear 후 새로 세팅
		// 사이즈
		if (product.getProductSizes() != null)
			product.getProductSizes().clear();
		if (sizeIds != null && !sizeIds.isEmpty()) {
			List<ProductSize> sizes = productSizeRepository.findAllById(sizeIds);
			product.getProductSizes().addAll(sizes);
		}
		// 색상
		if (product.getProductColors() != null)
			product.getProductColors().clear();
		if (colorIds != null && !colorIds.isEmpty()) {
			List<ProductColor> colors = productColorRepository.findAllById(colorIds);
			product.getProductColors().addAll(colors);
		}
		// 옵션
		if (product.getProductOptions() != null)
			product.getProductOptions().clear();
		if (optionIds != null && !optionIds.isEmpty()) {
			List<ProductOption> options = productOptionRepository.findAllById(optionIds);
			product.getProductOptions().addAll(options);
		}
		// 태그
		if (product.getProductTags() != null)
			product.getProductTags().clear();
		if (tagIds != null && !tagIds.isEmpty()) {
			List<ProductTag> tags = productTagRepository.findAllById(tagIds);
			product.getProductTags().addAll(tags);
		}

		// 5. 파일 저장 경로
		String baseDir = commonPath + "/product/" + code;
		String repDir = baseDir + "/rep/";
		String slideDir = baseDir + "/slide/";
		String filesDir = baseDir + "/files/";
		String repRoad = "/administration/upload/product/" + code + "/rep/";
		String slideRoad = "/administration/upload/product/" + code + "/slide/";
		String filesRoad = "/administration/upload/product/" + code + "/files/";

		// 6. 대표이미지 처리
		if (Boolean.TRUE.equals(deleteRepImage)) {
			String oldPath = product.getProductRepImagePath();
			if (oldPath != null) {
				File oldFile = new File(oldPath);
				if (oldFile.exists())
					oldFile.delete();
			}
			product.setProductRepImagePath(null);
			product.setProductRepImageRoad(null);
			product.setProductRepImageName(null);
			product.setProductRepImageExtension(null);
			product.setProductRepImageOriginalName(null);
			if (productImage != null && !productImage.isEmpty()) {
				saveProductRepImage(product, productImage, repDir, repRoad);
			}
		} else if (productImage != null && !productImage.isEmpty()) {
			String oldPath = product.getProductRepImagePath();
			if (oldPath != null) {
				File oldFile = new File(oldPath);
				if (oldFile.exists())
					oldFile.delete();
			}
			saveProductRepImage(product, productImage, repDir, repRoad);
		}
		// else : 유지

		// 7. 도면파일 처리 (기존 파일 실제삭제 → 컬렉션 clear → 신규 저장/유지)
		if (Boolean.TRUE.equals(deleteDrawingImage) || (drawingImage != null && !drawingImage.isEmpty())) {
			if (product.getFiles() != null && !product.getFiles().isEmpty()) {
				product.getFiles().forEach(pf -> {
					if (pf.getProductFilePath() != null) {
						File ff = new File(pf.getProductFilePath());
						if (ff.exists())
							ff.delete();
					}
				});
				product.getFiles().clear(); // orphanRemoval=true 가정
			}
		}
		if (drawingImage != null && !drawingImage.isEmpty()) {
			saveDrawingFile(product, drawingImage, filesDir, filesRoad); // 🔁 메서드명 & 구현 아래 참고
		}
		// else: 유지 (신규없으면 files 비어있는 채로 저장됨)

		// 8. 슬라이드 이미지 처리 (삭제/신규등록)
		// 1) 일부/전체 삭제
		if (deleteSlideImageIds != null && !deleteSlideImageIds.trim().isEmpty()) {
			String[] delIds = deleteSlideImageIds.split(",");
			Iterator<ProductImage> iter = product.getImages() != null ? product.getImages().iterator() : null;
			if (iter != null) {
				while (iter.hasNext()) {
					ProductImage img = iter.next();
					if (img.getId() != null && Arrays.asList(delIds).contains(String.valueOf(img.getId()))) {
						String imgPath = img.getProductImagePath();
						if (imgPath != null) {
							File f = new File(imgPath);
							if (f.exists())
								f.delete();
						}
						iter.remove(); // 컬렉션에서 삭제 (orphanRemoval)
					}
				}
			}
		}
		// 2) 신규 전체등록(교체)
		if (slideImages != null && slideImages.stream().anyMatch(f -> !f.isEmpty())) {
			if (product.getImages() != null) {
				for (ProductImage img : product.getImages()) {
					String imgPath = img.getProductImagePath();
					if (imgPath != null) {
						File f = new File(imgPath);
						if (f.exists())
							f.delete();
					}
				}
				product.getImages().clear(); // 전체 삭제 (orphanRemoval)
			}
			for (MultipartFile f : slideImages) {
				if (!f.isEmpty()) {
					saveSlideImage(product, f, slideDir, slideRoad);
				}
			}
		}

		// 9. 저장 (연관관계 포함)
		productRepository.save(product);
	}

	// ====== 헬퍼 메서드 ======
	private void saveProductRepImage(Product product, MultipartFile mf, String dir, String road) throws IOException {
		File d = new File(dir);
		if (!d.exists())
			d.mkdirs();
		String fileName = createRandomFileName(mf.getOriginalFilename());
		File dest = new File(dir, fileName);
		mf.transferTo(dest);

		String extension = getFileExtension(fileName);
		product.setProductRepImageName(fileName);
		product.setProductRepImageExtension(extension);
		product.setProductRepImageOriginalName(mf.getOriginalFilename());
		product.setProductRepImagePath(dest.getAbsolutePath());
		product.setProductRepImageRoad(road + fileName);
	}

	private void saveDrawingFile(Product product, MultipartFile file, String filesDir, String filesRoad)
			throws IOException {

		if (file == null || file.isEmpty())
			return;

// 디렉터리 보장
		File dir = new File(filesDir);
		if (!dir.exists())
			dir.mkdirs();

// 파일명 생성
		final int leftLimit = 48, rightLimit = 122, len = 10;
		Random random = new Random();
		String randomName = random.ints(leftLimit, rightLimit + 1)
				.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(len)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();

		String contentType = (file.getContentType() == null) ? "" : file.getContentType().toLowerCase();
		if (ObjectUtils.isEmpty(contentType)) {
			throw new IllegalArgumentException("파일의 contentType이 비어 있습니다.");
		}

		String ext;
		if (contentType.contains("image/jpeg") || contentType.contains("image/jpg"))
			ext = ".jpg";
		else if (contentType.contains("image/png"))
			ext = ".png";
		else if (contentType.contains("image/gif"))
			ext = ".gif";
		else if (contentType.contains("application/pdf") || contentType.contains("pdf"))
			ext = ".pdf";
		else if (contentType.contains("image/webp") || contentType.contains("webp"))
			ext = ".webp";
		else
			throw new IllegalArgumentException("허용되지 않는 파일 타입입니다: " + contentType);

		String saveName = randomName + ext;
		String savePath = filesDir + saveName;
		String road = filesRoad + saveName;

// 저장
		File target = new File(savePath);
		File parent = target.getParentFile();
		if (!parent.exists())
			parent.mkdirs();
		file.transferTo(target);

// 엔티티 저장
		ProductFile pf = new ProductFile();
		pf.setProduct(product);
		pf.setProductFileOriginalName(file.getOriginalFilename());
		pf.setProductFileExtension(ext); // ".pdf" 등
		pf.setProductFilePath(savePath); // 실제 경로
		pf.setProductFileRoad(road); // 접근 URL
		pf.setProductFileName(saveName);
		pf.setProductFileDate(new Date());
		pf.setSign(true);

// 양방향이면 product.getFiles().add(pf) 필요
		product.getFiles().add(pf);
// productFileRepository.save(pf); // Cascade 설정에 따라 생략/유지
	}

	private void saveSlideImage(Product product, MultipartFile mf, String dir, String road) throws IOException {
		File d = new File(dir);
		if (!d.exists())
			d.mkdirs();
		String fileName = createRandomFileName(mf.getOriginalFilename());
		File dest = new File(dir, fileName);
		mf.transferTo(dest);

		ProductImage pi = new ProductImage();
		pi.setProduct(product); // 반드시 세팅
		pi.setProductImageName(fileName);
		pi.setProductImageOriginalName(mf.getOriginalFilename());
		pi.setProductImageExtension(getFileExtension(fileName));
		pi.setProductImagePath(dest.getAbsolutePath());
		pi.setProductImageRoad(road + fileName);
		pi.setProductImageDate(new Date());
		pi.setSign(true);

		product.getImages().add(pi); // 컬렉션에 추가 (orphanRemoval)
	}

	private String createRandomFileName(String originName) {
		String ext = "";
		int idx = originName.lastIndexOf('.');
		if (idx >= 0)
			ext = originName.substring(idx);
		return UUID.randomUUID().toString().replace("-", "") + ext;
	}

	private String getFileExtension(String fileName) {
		int idx = fileName.lastIndexOf('.');
		return idx >= 0 ? fileName.substring(idx) : "";
	}

	@Transactional(readOnly = true)
	public Product findProductWithDetails(Long id) {
		return productRepository.findById(id).get();
	}

	public boolean isProductCodeDuplicate(String productCode) {
		return productRepository.existsByProductCode(productCode);
	}

	public boolean isProductCodeDuplicate(String productCode, Long productId) {
		// 수정: 코드가 있고, 그 코드의 상품이 나 자신이면 중복 아님
		Optional<Product> product = productRepository.findByProductCode(productCode);
		if (product.isPresent()) {
			if (product.get().getId().equals(productId)) {
				return false; // 본인 상품이면 중복 아님
			}
			return true; // 타 상품에 사용 중
		}
		return false; // 사용 중 아님
	}

	public byte[] processExcelFile(MultipartFile file) throws IOException {
		// 엑셀 파일을 읽어들입니다.
		XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
		XSSFSheet sheet = workbook.getSheetAt(2); // 세 번째 시트 (index 2)

		// 셀 스타일 설정
		CellStyle boldRedStyle = workbook.createCellStyle();
		Font boldRedFont = workbook.createFont();
		boldRedFont.setBold(true);
		boldRedFont.setColor(IndexedColors.RED.getIndex());
		boldRedStyle.setFont(boldRedFont);

		// 세 번째 시트의 두 번째 열을 순회하며 제품 코드를 조회합니다.
		for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) { // 두 번째 행부터 시작 (index 1)
			Row row = sheet.getRow(rowIndex);
			if (row != null) {
				Cell cell = row.getCell(1); // 두 번째 열 (index 1)
				if (cell != null) {
					String productCode = cell.getStringCellValue();
					Optional<Product> productOpt = productRepository.findByProductCode(productCode);

					if (productOpt.isPresent()) {
						Product product = productOpt.get();
						String productRepImageRoad = product.getProductRepImageRoad();
						if (productRepImageRoad != null
								&& (productRepImageRoad.contains("/front/clean/sample/prepare.png")
										|| productRepImageRoad.contains("prepare.png"))) {
							cell.setCellStyle(boldRedStyle);
						}
					}
				}
			}
		}

		// 엑셀 파일을 바이트 배열로 변환하여 반환합니다.
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		workbook.write(outputStream);
		workbook.close();
		return outputStream.toByteArray();
	}

	public Page<Product> getProductsByCriteria(Long tagId, Long colorId, Long middleSortId, Long bigSortId,
			Pageable pageable) {

		Optional<MiddleSort> middleSortOpt = productMiddleSortRepository.findById(middleSortId);

		boolean isMiddleSortAll = middleSortId == 0L
				|| (middleSortOpt.isPresent() && "분류전체".equals(middleSortOpt.get().getName()));
		boolean isTagIdNullOrZero = tagId == null || tagId == 0L;
		boolean isColorIdNullOrZero = colorId == null || colorId == 0L;

		if (isMiddleSortAll) {
			if (!isTagIdNullOrZero && !isColorIdNullOrZero) {
				return productRepository.findByTagColorAndBigSort(tagId, colorId, bigSortId, pageable);
			} else if (!isTagIdNullOrZero) {
				return productRepository.findByTagAndBigSort(tagId, bigSortId, pageable);
			} else if (!isColorIdNullOrZero) {
				return productRepository.findByColorAndBigSort(colorId, bigSortId, pageable);
			} else {
				return productRepository.findByBigSort(bigSortId, pageable);
			}
		} else {
			if (!isTagIdNullOrZero && !isColorIdNullOrZero) {
				return productRepository.findByTagColorAndSorts(tagId, colorId, middleSortId, bigSortId, pageable);
			} else if (!isTagIdNullOrZero) {
				return productRepository.findByTagAndSorts(tagId, middleSortId, bigSortId, pageable);
			} else if (!isColorIdNullOrZero) {
				return productRepository.findByColorAndSorts(colorId, middleSortId, bigSortId, pageable);
			} else {
				return productRepository.findBySorts(middleSortId, bigSortId, pageable);
			}
		}
	}

	public List<Product> getRandomProductsByTag(Product product) {
		List<Long> tagIds = product.getProductTags().stream().map(ProductTag::getId).collect(Collectors.toList());
		return productRepository.findRandomProductsByTag(tagIds, product.getId()).stream().limit(10)
				.collect(Collectors.toList());
	}

	public Product productInsert(ProductDTO dto) throws IllegalStateException, IOException {

		int leftLimit = 48; // numeral '0'
		int rightLimit = 122; // letter 'z'
		int targetStringLength = 10;
		Random random = new Random();
		String generatedString = random.ints(leftLimit, rightLimit + 1)
				.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97)).limit(targetStringLength)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();

		// 실제 파일 저장 위치 (절대 경로)
		String path = commonPath + "/product/" + dto.getProductCode() + "/rep/";

		// 파일 resource 로드 url
		String road = "/administration/upload/product/" + dto.getProductCode() + "/rep/";

		int index = 1;
		if (productRepository.findFirstIndex().isPresent()) {
			index = productRepository.findFirstIndex().get() + 1;
		}
		Product product = new Product();
		product.setName(dto.getProductName());
		product.setProductCode(dto.getProductCode());
		product.setTitle(StringUtils.hasText(dto.getProductTitle()) ? dto.getProductTitle() : "-");
		product.setSubject(StringUtils.hasText(dto.getSubject()) ? dto.getSubject() : "-");
		product.setHandle(dto.getHandle());
		product.setOrder(dto.getOrder());
		product.setProductSign(true);
		product.setUnit("EA");
		product.setBigSort(productBigSortRepository.findById(dto.getBigSort()).get());
		product.setMiddleSort(productMiddleSortRepository.findById(dto.getMiddleSort()).get());
		product.setProductIndex(index);

		List<ProductColor> colors = new ArrayList<>();
		if (dto.getColors() != null) {
			for (Long id : dto.getColors()) {
				colors.add(productColorRepository.findById(id).get());
			}
			product.setProductColors(colors);
		}

		List<ProductOption> options = new ArrayList<>();
		if (dto.getOptions() != null) {
			for (Long id : dto.getOptions()) {
				options.add(productOptionRepository.findById(id).get());
			}
			product.setProductOptions(options);
		}

		List<ProductTag> tags = new ArrayList<>();
		if (dto.getTags() != null) {
			for (Long id : dto.getTags()) {
				tags.add(productTagRepository.findById(id).get());
			}
			product.setProductTags(tags);
		}

		List<ProductSize> sizes = new ArrayList<>();
		if (dto.getSizes() != null) {
			for (Long id : dto.getSizes()) {
				sizes.add(productSizeRepository.findById(id).get());
			}
			product.setProductSizes(sizes);
		}

		if (dto.getProductImage() == null || dto.getProductImage().isEmpty()) {
			throw new IllegalArgumentException("대표이미지는 반드시 첨부해야 합니다.");
		}

		String contentType = dto.getProductImage().getContentType();
		String originalFileExtension = "";

		if (ObjectUtils.isEmpty(contentType)) {
			throw new IllegalArgumentException("대표이미지 파일의 Content-Type이 비어 있습니다.");
		} else {
			if (contentType.contains("image/jpeg")) {
				originalFileExtension = ".jpg";
			} else if (contentType.contains("image/png")) {
				originalFileExtension = ".png";
			} else if (contentType.contains("image/webp")) { // ✅ webp 추가
                originalFileExtension = ".webp";
            } 
		}
		String productImageName = generatedString + originalFileExtension;
		String productImagePath = path + productImageName; // rep/랜덤명.png
		String productImageRoad = road + productImageName; // rep/랜덤명.png

		// Create directory if it does not exist
		File directory = new File(path);
		if (!directory.exists()) {
			boolean dirsCreated = directory.mkdirs();
			System.out.println("Directories created: " + dirsCreated);
		}

		// Check if directory exists and is writable
		if (directory.exists() && directory.isDirectory() && directory.canWrite()) {
			File productImageSaveFile = new File(productImagePath);
			dto.getProductImage().transferTo(productImageSaveFile);

			product.setProductRepImageOriginalName(dto.getProductImage().getOriginalFilename());
			product.setProductRepImageName(productImageName);
			product.setProductRepImageExtension(originalFileExtension);
			product.setProductRepImageRoad(productImageRoad);
			product.setProductRepImagePath(productImagePath);

			Product savedProduct = productRepository.save(product);

			return savedProduct;
		} else {
			throw new IOException(
					"Cannot create directories or no write permission for the path: " + directory.getAbsolutePath());
		}
	}

	public Page<Product> findAllByBigMiddleTagColor(Pageable pageable, Long id) {
		Page<Product> products = productRepository.findAllByBigSortOrderByProductIndexAsc(pageable,
				productBigSortRepository.findById(id).get());

		return products;
	}

	public Page<Product> getFilteredProductList(Long bigId, Long middleId, String keyword, int page, int size) {
		PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
		return productRepository.searchByFilters(bigId, middleId, keyword, pageable);
	}

	public List<BigSort> getAllBigSorts() {
		return productBigSortRepository.findAll();
	}

	public List<MiddleSort> getMiddleSortsByBigSort(Long bigId) {
		BigSort bigSort = productBigSortRepository.findById(bigId)
				.orElseThrow(() -> new IllegalArgumentException("해당 대분류 없음: " + bigId));
		return productMiddleSortRepository.findAllByBigSort(bigSort);
	}

	public void deleteProduct(Long productId) {
		productRepository.deleteById(productId);
	}

}
