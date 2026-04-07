package com.dev.HiddenBath.utils;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.repository.product.ProductRepository;

@Component
public class RotationUtils {

	@Autowired
    private ProductRepository productRepository;

    private static final String COMMON_PATH = "D:/TempDirectory";
    private static final String UPLOAD_DIR = COMMON_PATH + "/upload";
    private static final String UNZIP_DIR = COMMON_PATH + "/unzip";

    public void processUpload(MultipartFile file) throws IOException {
        // Step 1: Upload the file
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        Path filePath = Paths.get(UPLOAD_DIR, file.getOriginalFilename());
        Files.write(filePath, file.getBytes());

        try {
            // Step 2: Unzip the file
            unzipFile(filePath.toString(), UNZIP_DIR);

            // Step 3: Process the unzipped folders and images
            processUnzippedFiles();
        } finally {
            // Clean up: Delete uploaded file and unzipped folders
            deleteFile(filePath.toString());
            deleteDirectory(new File(UNZIP_DIR));
        }
    }

    private void unzipFile(String zipFilePath, String destDir) throws IOException {
        File dir = new File(destDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        byte[] buffer = new byte[1024];
        ZipInputStream zis = new ZipInputStream(Files.newInputStream(Paths.get(zipFilePath)));
        ZipEntry zipEntry = zis.getNextEntry();
        while (zipEntry != null) {
            File newFile = new File(destDir, zipEntry.getName());
            if (zipEntry.isDirectory()) {
                newFile.mkdirs();
            } else {
                new File(newFile.getParent()).mkdirs();
                Files.copy(zis, newFile.toPath());
            }
            zipEntry = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
    }

    private void processUnzippedFiles() {
        File unzippedDir = new File(UNZIP_DIR);
        File[] productFolders = unzippedDir.listFiles(File::isDirectory);

        if (productFolders != null) {
            // Step 4: Update productSign for products in rotation.zip
            for (File productFolder : productFolders) {
                String productCode = productFolder.getName();
                Optional<Product> productOptional = productRepository.findByProductCode(productCode);
                if (productOptional.isPresent()) {
                    Product product = productOptional.get();
                    product.setProductSign(true);

                    // Step 5: Process images inside the product folder
                    File[] imageFiles = productFolder.listFiles((dir, name) -> name.endsWith(".jpg") || name.endsWith(".png"));
                    if (imageFiles != null) {
                        product.setProductRotationNumber(imageFiles.length);
                    }

                    productRepository.save(product);
                }
            }

            // Step 6: Set productSign to false for all other products
            List<Product> allProducts = productRepository.findAll();
            for (Product product : allProducts) {
                if (!product.getProductSign()) {
                    product.setProductSign(false);
                    productRepository.save(product);
                }
            }
        }
    }

    private void deleteFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            // Log the error or handle accordingly
            e.printStackTrace();
        }
    }

    private void deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        directoryToBeDeleted.delete();
    }
}