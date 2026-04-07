package com.dev.HiddenBath.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.zeroturnaround.zip.ZipUtil;

import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.model.product.ProductFile;
import com.dev.HiddenBath.model.product.ProductImage;
import com.dev.HiddenBath.repository.product.ProductFileRepository;
import com.dev.HiddenBath.repository.product.ProductImageRepository;
import com.dev.HiddenBath.repository.product.ProductRepository;
import com.dev.HiddenBath.utils.DirectoryRefactoringUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ZipService {

	@Autowired
	ProductRepository productRepository;

	@Autowired
	ProductImageRepository productImageRepository;

	@Autowired
	ProductFileRepository productFileRepository;

	@Autowired
	DirectoryRefactoringUtils directoryRefactoringUtils;

	@Value("${spring.upload.env}")
	private String env;

	@Value("${spring.upload.path}")
	private String commonPath;

	
	public void refactorAndPrepareDownload(MultipartFile file) throws IOException {
        // 경로 설정
        File destDir = new File(commonPath, "PRODUCT");
        if (!destDir.exists()) {
            destDir.mkdirs(); // 폴더가 존재하지 않으면 생성
        }

        // 업로드된 파일을 지정된 경로에 저장
        File zipFile = new File(destDir, file.getOriginalFilename());
        file.transferTo(zipFile);

        // 압축 해제
        extractZipFile(zipFile, destDir);

        // 최종 압축 파일 생성 (덮어쓰기)
        File finalZipFile = new File(commonPath, "PRODUCT.zip");
        FileOutputStream fos = new FileOutputStream(finalZipFile);
        ZipOutputStream zos = new ZipOutputStream(fos);

        zipFile(destDir, destDir.getName(), zos);
        zos.close();
        fos.close();

        // 임시 파일 삭제 (옵션)
        zipFile.delete();
    }

    private void extractZipFile(File zipFile, File destDir) throws IOException {
        byte[] buffer = new byte[1024];
        ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile));
        ZipEntry zipEntry = zis.getNextEntry();
        while (zipEntry != null) {
            File newFile = newFile(destDir, zipEntry);
            if (zipEntry.isDirectory()) {
                if (!newFile.isDirectory() && !newFile.mkdirs()) {
                    throw new IOException("Failed to create directory " + newFile);
                }
            } else {
                File parent = newFile.getParentFile();
                if (!parent.isDirectory() && !parent.mkdirs()) {
                    throw new IOException("Failed to create directory " + parent);
                }

                FileOutputStream fos = new FileOutputStream(newFile);
                int len;
                while ((len = zis.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }
                fos.close();
            }
            zipEntry = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
    }

    private File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());

        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();

        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }

        return destFile;
    }

    private void zipFile(File fileToZip, String fileName, ZipOutputStream zos) throws IOException {
        if (fileToZip.isHidden()) {
            return;
        }
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith("/")) {
                zos.putNextEntry(new ZipEntry(fileName));
                zos.closeEntry();
            } else {
                zos.putNextEntry(new ZipEntry(fileName + "/"));
                zos.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, fileName + "/" + childFile.getName(), zos);
            }
            return;
        }
        FileInputStream fis = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zos.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while ((length = fis.read(bytes)) >= 0) {
            zos.write(bytes, 0, length);
        }
        fis.close();
    }

	public void directoryRefactoring(MultipartFile file) throws IOException {
		directoryRefactoringUtils.handleZipUpload(file);
	}

	@Transactional
    public List<String> zipProductInsert(MultipartFile file) throws IOException {
        String productDirPath = commonPath + "/product";
        File productDir = new File(productDirPath);

        // 기존 ProductImage 및 ProductFile 정보 삭제
        productImageRepository.deleteAll();
        productFileRepository.deleteAll();

        // 기존 product 폴더 삭제
        cleanAndCreateDirectory(productDir);

        // 기존 Product 엔티티의 이미지 필드 초기화
        List<Product> allProducts = productRepository.findAll();
        for (Product product : allProducts) {
            product.setProductRepImageName(null);
            product.setProductRepImageExtension(null);
            product.setProductRepImageOriginalName(null);
            product.setProductRepImagePath(null);
            product.setProductRepImageRoad(null);
            productRepository.save(product);
        }

        File zipFile = new File(commonPath + "/product.zip");
        try (InputStream is = file.getInputStream(); FileOutputStream fos = new FileOutputStream(zipFile)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = is.read(buffer)) != -1) {
                fos.write(buffer, 0, bytesRead);
            }
        }

        unzipFile(zipFile, productDir);
        List<String> notFoundProductCodes = processProductFiles(productDir);

        // 업로드된 zip 파일 삭제 예약
        zipFile.deleteOnExit();

        return notFoundProductCodes;
    }

    private void cleanAndCreateDirectory(File directory) throws IOException {
        if (directory.exists() && directory.isDirectory()) {
            FileUtils.deleteDirectory(directory);
        }
        directory.mkdirs();
    }

    private void unzipFile(File zipFile, File destDir) throws IOException {
        if (!destDir.exists()) {
            destDir.mkdirs();
        }

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                File newFile = new File(destDir, entry.getName());
                if (entry.isDirectory()) {
                    if (!newFile.isDirectory() && !newFile.mkdirs()) {
                        throw new IOException("Failed to create directory " + newFile);
                    }
                } else {
                    File parent = newFile.getParentFile();
                    if (!parent.isDirectory() && !parent.mkdirs()) {
                        throw new IOException("Failed to create directory " + parent);
                    }

                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zis.closeEntry();
            }
        }
    }

    private List<String> processProductFiles(File productDir) {
        List<String> notFoundProductCodes = new ArrayList<>();
        Set<String> folderProductCodes = Arrays.stream(Objects.requireNonNull(productDir.listFiles()))
                .filter(File::isDirectory)
                .map(File::getName)
                .collect(Collectors.toSet());

        List<Product> allProducts = productRepository.findAll();
        for (Product product : allProducts) {
            String productCode = product.getProductCode();
            if (folderProductCodes.contains(productCode)) {
                File productFolder = new File(productDir, productCode);
                for (File sort : Objects.requireNonNull(productFolder.listFiles())) {
                    if (sort.isDirectory()) {
                        processSortedFiles(sort, productCode);
                    }
                }
            } else {
                notFoundProductCodes.add(productCode);
                setDefaultImagePaths(product);
            }
        }
        return notFoundProductCodes;
    }

    private void processSortedFiles(File sort, String productCode) {
        switch (sort.getName()) {
            case "slide":
                productRepository.findByProductCode(productCode).ifPresent(productEntity -> saveProductImages(sort, productEntity, productCode));
                break;
            case "rep":
                saveRepImage(sort, productCode);
                break;
            case "files":
                productRepository.findByProductCode(productCode).ifPresent(productEntity -> saveProductFiles(sort, productEntity, productCode));
                break;
        }
    }

    private void saveProductImages(File sort, Product productEntity, String productCode) {
        for (File file : Objects.requireNonNull(sort.listFiles())) {
            String fileName = file.getName();
            ProductImage image = new ProductImage();
            image.setProduct(productEntity);
            image.setProductImagePath(commonPath + "/product/" + productCode + "/slide/" + fileName);
            image.setProductImageRoad("/administration/upload/product/" + productCode + "/slide/" + fileName);
            image.setProductImageName(fileName);
            image.setSign(true);
            image.setProductImageExtension(fileName.substring(fileName.lastIndexOf('.')));
            image.setProductImageOriginalName(file.getName());
            image.setProductImageDate(new Date());
            productImageRepository.save(image);
        }
    }

    private void saveRepImage(File sort, String productCode) {
        productRepository.findByProductCode(productCode).ifPresentOrElse(productEntity -> {
            for (File file : Objects.requireNonNull(sort.listFiles())) {
                String fileName = file.getName();
                productEntity.setProductRepImageName(fileName);
                productEntity.setProductRepImageExtension(fileName.substring(fileName.lastIndexOf('.')));
                productEntity.setProductRepImageOriginalName(fileName);
                productEntity.setProductRepImagePath(commonPath + "/product/" + productCode + "/rep/" + fileName);
                productEntity.setProductRepImageRoad("/administration/upload/product/" + productCode + "/rep/" + fileName);
                productRepository.save(productEntity); // Ensure save is called here
            }
        }, () -> System.out.println("No product entity found for code: " + productCode));
    }

    private void saveProductFiles(File sort, Product productEntity, String productCode) {
        for (File file : Objects.requireNonNull(sort.listFiles())) {
            String fileName = file.getName();
            ProductFile productFile = new ProductFile();
            productFile.setProduct(productEntity);
            productFile.setProductFilePath(commonPath + "/product/" + productCode + "/files/" + fileName);
            productFile.setProductFileRoad("/administration/upload/product/" + productCode + "/files/" + fileName);
            productFile.setProductFileName(fileName);
            productFile.setProductFileOriginalName(fileName);
            productFile.setSign(true);
            productFile.setProductFileExtension(fileName.substring(fileName.lastIndexOf('.')));
            productFile.setProductFileDate(new Date());
            productFileRepository.save(productFile);
        }
    }

    private void setDefaultImagePaths(Product product) {
        product.setProductRepImageName("-");
        product.setProductRepImageExtension("-");
        product.setProductRepImageOriginalName("-");
        product.setProductRepImagePath("-");
        product.setProductRepImageRoad("/front/clean/sample/prepare.png");
        
        ProductImage slideImage = new ProductImage();
        slideImage.setProduct(product);
        slideImage.setProductImagePath("-");
        slideImage.setProductImageRoad("/front/clean/sample/prepare.png");
        slideImage.setProductImageName("-");
        slideImage.setSign(true);
        slideImage.setProductImageExtension("-");
        slideImage.setProductImageOriginalName("-");
        slideImage.setProductImageDate(new Date());
        productImageRepository.save(slideImage);

        productRepository.save(product);
    }

    public File createZip(String env) throws IOException {
        String absolutePath = new File("").getAbsolutePath() + "/";
        String existFilePath = "";
        String zipFilePath = "";
        if (env.equals("local")) {
            existFilePath = absolutePath + commonPath + "/company";
            zipFilePath = absolutePath + "company.zip";
        } else if (env.equals("prod")) {
            existFilePath = commonPath + "/company";
            zipFilePath = commonPath + "company.zip";
        }
        ZipUtil.pack(new File(existFilePath), new File(zipFilePath));
        return new File(zipFilePath);
    }

}
