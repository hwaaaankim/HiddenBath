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
import com.dev.HiddenBath.model.product.ProductFile;
import com.dev.HiddenBath.repository.product.ProductFileRepository;

@Service
public class ProductFileService {

	@Autowired
	ProductFileRepository productFileRepository;
	
	@Value("${spring.upload.env}")
	private String env;
	
	@Value("${spring.upload.path}")
	private String commonPath;
	
	public Boolean fileDelete(
			Long id
			) {
		List<ProductFile> files = productFileRepository.findAllByProductId(id);
		for(ProductFile p : files) {
			File pFile = new File(p.getProductFilePath());
			if(!pFile.delete()) {
				return false;
			}
		}
		
		return true;
	}
	
	public String fileUpload(Product product, List<MultipartFile> productFiles)
	        throws IllegalStateException, IOException {

	    String path = commonPath
	            + "/product/"
	            + product.getProductCode()
	            + "/files/"; // 마지막 / 꼭 포함

	    String road = "/administration/upload/product/"
	            + product.getProductCode()
	            + "/files/"; // 마지막 / 꼭 포함

	    // 폴더 생성
	    File dir = new File(path);
	    if (!dir.exists()) dir.mkdirs();

	    int leftLimit = 48;
	    int rightLimit = 122;
	    int targetStringLength = 10;
	    Random random = new Random();

	    for (MultipartFile file : productFiles) {
	        if (file != null && !file.isEmpty()) {
	            String generatedString = random.ints(leftLimit, rightLimit + 1)
	                    .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
	                    .limit(targetStringLength)
	                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
	                    .toString();
	            ProductFile f = new ProductFile();
	            f.setProduct(product);
	            String contentType = file.getContentType();
	            String originalFileExtension = "";

	            if (ObjectUtils.isEmpty(contentType)) {
	                throw new IllegalArgumentException("파일의 contentType이 비어 있습니다.");
	            } else {
	                // 허용 파일 확장자
	                if (contentType.contains("image/jpeg")) {
	                    originalFileExtension = ".jpg";
	                } else if (contentType.contains("image/png")) {
	                    originalFileExtension = ".png";
	                } else if (contentType.contains("image/gif")) {
	                    originalFileExtension = ".gif";
	                } else if (contentType.contains("application/pdf")) {
	                    originalFileExtension = ".pdf";
	                } else if (contentType.contains("application/x-zip-compressed")) {
	                    originalFileExtension = ".zip";
	                } else if (contentType.contains("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
	                    originalFileExtension = ".xlsx";
	                } else if (contentType.contains("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
	                    originalFileExtension = ".docx";
	                } else if (contentType.contains("text/plain")) {
	                    originalFileExtension = ".txt";
	                } else if (contentType.contains("image/x-icon")) {
	                    originalFileExtension = ".ico";
	                } else if (contentType.contains("application/haansofthwp")) {
	                    originalFileExtension = ".hwp";
	                } else if (contentType.contains("image/webp")) { // ✅ webp 추가
	                    originalFileExtension = ".webp";
	                } else {
	                    throw new IllegalArgumentException("허용되지 않는 파일 타입입니다: " + contentType);
	                }
	            }
	            String productFileName = generatedString + originalFileExtension;
	            String productFilePath = path + productFileName;
	            String productFileRoad = road + productFileName;

	            // 파일 저장
	            File productFileSaveFile = new File(productFilePath);
	            File parentDir = productFileSaveFile.getParentFile();
	            if (!parentDir.exists()) parentDir.mkdirs();
	            file.transferTo(productFileSaveFile);

	            f.setProductFileOriginalName(file.getOriginalFilename());
	            f.setProductFileExtension(originalFileExtension);
	            f.setProductFilePath(productFilePath);
	            f.setProductFileRoad(productFileRoad);
	            f.setProductFileName(productFileName);
	            f.setProductFileDate(new Date());
	            f.setSign(true);

	            productFileRepository.save(f);
	        }
	    }
	    return "success";
	}

}
























