package com.dev.HiddenBath.service.product;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.model.product.ProductImage;
import com.dev.HiddenBath.repository.product.ProductBigSortRepository;
import com.dev.HiddenBath.repository.product.ProductImageRepository;
import com.dev.HiddenBath.repository.product.ProductMiddleSortRepository;

@Service
public class ProductImageService {
	
	@Autowired
	ProductImageRepository productImageRepository;
	
	@Autowired
	ProductMiddleSortRepository productMiddleSortRepository;
	
	@Autowired
	ProductBigSortRepository productBigSortRepository;
	
	@Value("${spring.upload.env}")
	private String env;
	
	@Value("${spring.upload.path}")
	private String commonPath;
	
	public String imageUpload(Product product, List<MultipartFile> images)
	        throws IllegalStateException, IOException {

	    String path = commonPath
	            + "/product/"
	            + product.getProductCode()
	            + "/slide/"; // 마지막 / 꼭 포함

	    String road = "/administration/upload/product/"
	            + product.getProductCode()
	            + "/slide/"; // 마지막 / 꼭 포함

	    // 폴더 생성
	    File dir = new File(path);
	    if (!dir.exists()) dir.mkdirs();

	    int leftLimit = 48;
	    int rightLimit = 122;
	    int targetStringLength = 10;
	    Random random = new Random();

	    for (MultipartFile file : images) {
	        if (file != null && !file.isEmpty()) {
	            String generatedString = random.ints(leftLimit, rightLimit + 1)
	                    .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
	                    .limit(targetStringLength)
	                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
	                    .toString();
	            ProductImage f = new ProductImage();
	            f.setProduct(product);
	            String contentType = file.getContentType();
	            String originalFileExtension = "";

	            if (ObjectUtils.isEmpty(contentType)) {
	                throw new IllegalArgumentException("파일의 contentType이 비어 있습니다.");
	            } else {
	                if (contentType.contains("image/jpeg")) {
	                    originalFileExtension = ".jpg";
	                } else if (contentType.contains("image/png")) {
	                    originalFileExtension = ".png";
	                }  else if (contentType.contains("image/webp")) { // ✅ webp 추가
	                    originalFileExtension = ".webp";
	                } else {
	                    throw new IllegalArgumentException("허용되지 않는 이미지 타입입니다: " + contentType);
	                }
	            }
	            String productImageName = generatedString + originalFileExtension;
	            String productImagePath = path + productImageName;
	            String productImageRoad = road + productImageName;

	            // 파일 저장
	            File productImageSaveFile = new File(productImagePath);
	            File parentDir = productImageSaveFile.getParentFile();
	            if (!parentDir.exists()) parentDir.mkdirs();
	            file.transferTo(productImageSaveFile);

	            f.setProductImageOriginalName(file.getOriginalFilename());
	            f.setProductImageExtension(originalFileExtension);
	            f.setProductImagePath(productImagePath);
	            f.setProductImageRoad(productImageRoad);
	            f.setProductImageName(productImageName);
	            f.setProductImageDate(new Date());
	            f.setSign(true);

	            productImageRepository.save(f);
	        }
	    }
	    return "success";
	}
	
	public Boolean imageDelete(
			Long id
			) {
		List<ProductImage> images = productImageRepository.findAllByProductId(id);
		for(ProductImage i : images) {
			File slide = new File(i.getProductImagePath());
			if(!slide.delete()) {
				return false;
			}
		}
		
		return true;
	}
}
