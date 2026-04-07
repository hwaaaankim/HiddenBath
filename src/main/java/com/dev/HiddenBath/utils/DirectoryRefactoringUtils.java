package com.dev.HiddenBath.utils;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class DirectoryRefactoringUtils {

    private static final String commonPath = "D:/Refactoring";
    private static final String UPLOAD_DIR = "upload";
    private static final String UNZIP_DIR = "unzip";
    private static final String NEW_STRUCTURE_DIR = "new_structure";

    public void handleZipUpload(MultipartFile file) throws IOException {
        initializeDirectories();
        File uploadedZip = saveUploadedFile(file);
        unzipFile(uploadedZip, Paths.get(commonPath, UNZIP_DIR));
        redistributeFiles(Paths.get(commonPath, UNZIP_DIR), Paths.get(commonPath, NEW_STRUCTURE_DIR));
        Files.delete(uploadedZip.toPath());
    }

    private void initializeDirectories() throws IOException {
        File uploadDir = new File(commonPath, UPLOAD_DIR);
        File unzipDir = new File(commonPath, UNZIP_DIR);
        File newStructureDir = new File(commonPath, NEW_STRUCTURE_DIR);

        if (uploadDir.exists()) {
            FileUtils.cleanDirectory(uploadDir);
        } else {
            uploadDir.mkdirs();
        }

        if (unzipDir.exists()) {
            FileUtils.cleanDirectory(unzipDir);
        } else {
            unzipDir.mkdirs();
        }

        if (newStructureDir.exists()) {
            FileUtils.cleanDirectory(newStructureDir);
        } else {
            newStructureDir.mkdirs();
        }
    }

    private File saveUploadedFile(MultipartFile file) throws IOException {
        File dir = new File(commonPath, UPLOAD_DIR);
        File uploadedFile = new File(dir, file.getOriginalFilename());
        try (InputStream is = file.getInputStream();
             OutputStream os = new FileOutputStream(uploadedFile)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = is.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
        }
        return uploadedFile;
    }

    private void unzipFile(File zipFile, Path destDir) throws IOException {
        if (!Files.exists(destDir)) {
            Files.createDirectories(destDir);
        }

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                Path newPath = resolveZipEntry(destDir, entry);

                if (entry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {
                    if (newPath.getParent() != null && Files.notExists(newPath.getParent())) {
                        Files.createDirectories(newPath.getParent());
                    }
                    try (OutputStream fos = Files.newOutputStream(newPath)) {
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

    private Path resolveZipEntry(Path destDir, ZipEntry entry) throws IOException {
        Path destPath = destDir.resolve(entry.getName());
        String destDirPath = destDir.toFile().getCanonicalPath();
        String destFilePath = destPath.toFile().getCanonicalPath();

        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + entry.getName());
        }
        return destPath;
    }

    private void redistributeFiles(Path sourceDir, Path targetDir) throws IOException {
        Files.walk(sourceDir)
            .filter(Files::isDirectory)
            .forEach(productDir -> {
                try {
                    if (productDir.equals(sourceDir)) return;

                    Path relativePath = sourceDir.relativize(productDir);
                    Path newProductDir = targetDir.resolve(relativePath);
                    Path resDir = newProductDir.resolve("rep");
                    Path slideDir = newProductDir.resolve("slide");
                    Path filesDir = newProductDir.resolve("files");

                    Files.createDirectories(resDir);
                    Files.createDirectories(slideDir);
                    Files.createDirectories(filesDir);

                    List<Path> imageFiles = Files.list(productDir)
                            .filter(Files::isRegularFile)
                            .collect(Collectors.toList());

                    for (Path image : imageFiles) {
                        Files.copy(image, filesDir.resolve(image.getFileName()), StandardCopyOption.REPLACE_EXISTING);
                        Files.copy(image, slideDir.resolve(image.getFileName()), StandardCopyOption.REPLACE_EXISTING);
                    }

                    Optional<Path> repImage = imageFiles.stream()
                            .filter(path -> path.getFileName().toString().equals("1.jpg") || path.getFileName().toString().equals("1.png"))
                            .findFirst();

                    if (repImage.isPresent()) {
                        Files.move(repImage.get(), resDir.resolve(repImage.get().getFileName()), StandardCopyOption.REPLACE_EXISTING);
                    } else if (!imageFiles.isEmpty()) {
                        Collections.shuffle(imageFiles);
                        Path randomImage = imageFiles.get(0);
                        Files.move(randomImage, resDir.resolve(randomImage.getFileName()), StandardCopyOption.REPLACE_EXISTING);
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
    }

    private String generateShortFileName(Path filePath) {
        String originalFileName = filePath.getFileName().toString();
        String extension = "";

        int index = originalFileName.lastIndexOf('.');
        if (index > 0) {
            extension = originalFileName.substring(index);
        }

        String shortFileName = RandomStringUtils.randomAlphabetic(10);
        return shortFileName + extension;
    }
}