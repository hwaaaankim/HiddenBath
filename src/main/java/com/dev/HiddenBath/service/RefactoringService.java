package com.dev.HiddenBath.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RefactoringService {

    @Value("${spring.upload.path}")
    private String commonPath;

    public String refactorAndZip(MultipartFile file) throws IOException {
        // 압축 해제 경로 설정
        File destDir = new File(commonPath, "PRODUCT");
        if (!destDir.exists()) {
            destDir.mkdirs();
        }

        // 업로드된 파일을 PRODUCT.zip으로 저장
        File uploadedZip = new File(destDir, "PRODUCT.zip");
        file.transferTo(uploadedZip);

        // 압축 해제
        unzipFile(uploadedZip, destDir);

        // 파일 구조 변경
        refactorDirectoryStructure(destDir);

        // 새로운 PRODUCT.zip 생성
        File newZipFile = new File(commonPath, "PRODUCT_refactored.zip");
        zipDirectory(destDir, newZipFile);

        // 경로 반환
        return newZipFile.getAbsolutePath();
    }

    private void unzipFile(File zipFile, File destDir) throws IOException {
        java.util.zip.ZipFile zip = new java.util.zip.ZipFile(zipFile);
        zip.stream().forEach(entry -> {
            try {
                File file = new File(destDir, entry.getName());
                if (entry.isDirectory()) {
                    file.mkdirs();
                } else {
                    file.getParentFile().mkdirs();
                    Files.copy(zip.getInputStream(entry), file.toPath());
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to unzip file", e);
            }
        });
        zip.close();
    }

    private void refactorDirectoryStructure(File rootDir) throws IOException {
        // Major_Category_1, Major_Category_2 등 하위 디렉토리 탐색
        for (File categoryDir : rootDir.listFiles(File::isDirectory)) {
            for (File productDir : categoryDir.listFiles(File::isDirectory)) {
                File slideDir = new File(productDir, "slide");

                if (slideDir.exists()) {
                    // slide 디렉토리 안의 파일 이름을 변경
                    for (File imageFile : slideDir.listFiles()) {
                        String newFileName = productDir.getName() + "_" + imageFile.getName();
                        Files.move(imageFile.toPath(), Paths.get(productDir.getAbsolutePath(), newFileName));
                    }
                }

                // files와 rep 디렉토리 삭제
                deleteDirectory(new File(productDir, "files"));
                deleteDirectory(new File(productDir, "rep"));

                // slide 디렉토리 삭제
                deleteDirectory(slideDir);
            }
        }
    }

    private void deleteDirectory(File dir) throws IOException {
        if (dir.exists()) {
            Files.walk(dir.toPath())
                .sorted((o1, o2) -> -o1.compareTo(o2))
                .map(Path::toFile)
                .forEach(File::delete);
        }
    }

    private void zipDirectory(File folder, File zipFile) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
            List<Path> paths = Files.walk(folder.toPath())
                    .filter(Files::isRegularFile)
                    .collect(Collectors.toList());

            for (Path path : paths) {
                ZipEntry zipEntry = new ZipEntry(folder.toPath().relativize(path).toString());
                zos.putNextEntry(zipEntry);
                Files.copy(path, zos);
                zos.closeEntry();
            }
        }
    }
}
