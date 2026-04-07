package com.dev.HiddenBath.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.model.product.BigSort;
import com.dev.HiddenBath.model.product.MiddleSort;
import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.model.product.ProductColor;
import com.dev.HiddenBath.model.product.ProductOption;
import com.dev.HiddenBath.model.product.ProductSize;
import com.dev.HiddenBath.model.product.ProductTag;
import com.dev.HiddenBath.repository.product.ProductBigSortRepository;
import com.dev.HiddenBath.repository.product.ProductColorRepository;
import com.dev.HiddenBath.repository.product.ProductFileRepository;
import com.dev.HiddenBath.repository.product.ProductImageRepository;
import com.dev.HiddenBath.repository.product.ProductMiddleSortRepository;
import com.dev.HiddenBath.repository.product.ProductOptionRepository;
import com.dev.HiddenBath.repository.product.ProductRepository;
import com.dev.HiddenBath.repository.product.ProductSizeRepository;
import com.dev.HiddenBath.repository.product.ProductTagRepository;
import com.dev.HiddenBath.service.product.ProductService;
import com.dev.HiddenBath.utils.ExcelUtils;

import jakarta.persistence.EntityManager;

@Service
public class ExcelUploadService {

	@Autowired
	ProductBigSortRepository productBigSortRepository;

	@Autowired
	ProductMiddleSortRepository productMiddleSortRepository;

	@Autowired
	ProductImageRepository productImageRepository;

	@Autowired
	ProductFileRepository productFileRepository;

	@Autowired
	ProductService productService;

	@Autowired
	ProductRepository productRepository;

	@Autowired
	ProductTagRepository productTagRepository;

	@Autowired
	ProductOptionRepository productOptionRepository;

	@Autowired
	ProductSizeRepository productSizeRepository;

	@Autowired
	ProductColorRepository productColorRepository;

	@Autowired
	ExcelUtils excelUtils;

	@Autowired
	private EntityManager entityManager; // EntityManager 주입

	@Autowired
	private PlatformTransactionManager transactionManager; // TransactionManager 주입

	
	public List<String> updateProductsFromExcel(MultipartFile file) throws IOException {
	    List<String> missingProducts = new ArrayList<>();
	    Workbook workbook = new XSSFWorkbook(file.getInputStream());
	    Sheet sheet = workbook.getSheetAt(2); // 3번째 시트 (index 2)

	    for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
	        Row row = sheet.getRow(i);
	        if (row != null) {
	            String productCode = excelUtils.getCellValue(row.getCell(1)); // 2번째 열 (index 1)
	            Optional<Product> productOptional = productRepository.findByProductCode(productCode);

	            if (productOptional.isPresent()) {
	                Product product = productOptional.get();
	                TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
	                transactionTemplate.execute(status -> {
	                    try {
	                        Long middleSortId = Long.parseLong(excelUtils.getCellValue(row.getCell(8))); // 9번째 열 (index 8)
	                        Long bigSortId = Long.parseLong(excelUtils.getCellValue(row.getCell(9))); // 10번째 열 (index 9)
	                        int productIndex = Integer.parseInt(excelUtils.getCellValue(row.getCell(15))); // 16번째 열 (index 15)

	                        MiddleSort middleSort = productMiddleSortRepository.findById(middleSortId)
	                                .orElseThrow(() -> new RuntimeException("MiddleSort not found with ID: " + middleSortId));
	                        BigSort bigSort = productBigSortRepository.findById(bigSortId)
	                                .orElseThrow(() -> new RuntimeException("BigSort not found with ID: " + bigSortId));

	                        product.setMiddleSort(middleSort);
	                        product.setBigSort(bigSort);
	                        product.setProductIndex(productIndex);

	                        productRepository.save(product);
	                    } catch (Exception e) {
	                        e.printStackTrace();
	                        throw new RuntimeException(e);
	                    }
	                    return null;
	                });
	            } else {
	                missingProducts.add(productCode); // 제품이 존재하지 않으면 목록에 추가
	            }
	        }
	    }

	    if (!missingProducts.isEmpty()) {
	        System.out.println("Missing products: " + String.join(", ", missingProducts));
	    }

	    return missingProducts;
	}

	
	public List<String> uploadExcel(MultipartFile file) throws IOException {
	    List<String> result = new ArrayList<>();
	    ExecutorService executorService = Executors.newSingleThreadExecutor();

	    Future<?> deleteFuture = executorService.submit(() -> {
	        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
	        transactionTemplate.execute(status -> {
	            try {
	                productRepository.deleteAll();
	                productFileRepository.deleteAll();
	                productImageRepository.deleteAll();
	            } catch (Exception e) {
	                System.out.println(e);
	            }
	            return null;
	        });
	    });

	    Future<?> insertFuture = executorService.submit(() -> {
	        try {
	            Workbook workbook = new XSSFWorkbook(file.getInputStream());
	            Sheet productSheet = workbook.getSheetAt(2);
	            for (int i = 1; i < productSheet.getPhysicalNumberOfRows(); i++) {
	                Row row = productSheet.getRow(i);

	                if (row != null) {
	                    TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
	                    transactionTemplate.execute(status -> {
	                        try {
	                            Product product = new Product();
	                            String codeValue = excelUtils.getCellValue(row.getCell(1));
	                            String nameValue = excelUtils.getCellValue(row.getCell(2));
	                            String signStr = excelUtils.getCellValue(row.getCell(3));
	                            String titleValue = excelUtils.getCellValue(row.getCell(4));
	                            String subjectValue = excelUtils.getCellValue(row.getCell(5));
	                            String handleStr = excelUtils.getCellValue(row.getCell(6));
	                            String orderStr = excelUtils.getCellValue(row.getCell(7));
	                            Long middleValue = Long.parseLong(excelUtils.getCellValue(row.getCell(8)));
	                            Long bigValue = Long.parseLong(excelUtils.getCellValue(row.getCell(9)));
	                            String tagStr = excelUtils.getCellValue(row.getCell(10));
	                            String optionStr = excelUtils.getCellValue(row.getCell(11));
	                            String sizeStr = excelUtils.getCellValue(row.getCell(12));
	                            String colorStr = excelUtils.getCellValue(row.getCell(13));

	                            Boolean signValue = "TRUE".equalsIgnoreCase(signStr.trim());
	                            Boolean handleValue = "TRUE".equalsIgnoreCase(handleStr.trim());
	                            Boolean orderValue = "TRUE".equalsIgnoreCase(orderStr.trim());

	                            int index = 1;
	                            if (productRepository.findFirstIndex().isPresent()) {
	                                index = productRepository.findFirstIndex().get() + 1;
	                            }

	                            if (!"NULL".equals(tagStr)) {
	                                String[] tagArr = tagStr.split(",");
	                                List<ProductTag> tagList = new ArrayList<>();
	                                for (String id : tagArr) {
	                                    tagList.add(productTagRepository.findById(Long.parseLong(id))
	                                            .orElseThrow(() -> new RuntimeException("Tag not found")));
	                                }
	                                product.setProductTags(tagList);
	                            }

	                            if (!"NULL".equals(optionStr)) {
	                                String[] optionArr = optionStr.split(",");
	                                List<ProductOption> optionList = new ArrayList<>();
	                                for (String id : optionArr) {
	                                    optionList.add(productOptionRepository.findById(Long.parseLong(id))
	                                            .orElseThrow(() -> new RuntimeException("Option not found")));
	                                }
	                                product.setProductOptions(optionList);
	                            }

	                            if (!"NULL".equals(sizeStr)) {
	                                String[] sizeArr = sizeStr.split(",");
	                                List<ProductSize> sizeList = new ArrayList<>();
	                                for (String id : sizeArr) {
	                                    sizeList.add(productSizeRepository.findById(Long.parseLong(id))
	                                            .orElseThrow(() -> new RuntimeException("Size not found")));
	                                }
	                                product.setProductSizes(sizeList);
	                            }

	                            if (!"NULL".equals(colorStr)) {
	                                String[] colorArr = colorStr.split(",");
	                                List<ProductColor> colorList = new ArrayList<>();
	                                for (String id : colorArr) {
	                                    ProductColor color = productColorRepository.findById(Long.parseLong(id))
	                                            .orElseThrow(() -> new RuntimeException("Color not found"));
	                                    colorList.add(entityManager.merge(color)); // merge 사용하여 detached 상태 해결
	                                }
	                                product.setProductColors(colorList);
	                            }

	                            product.setProductCode(codeValue);
	                            product.setName(nameValue);
	                            product.setProductSign(signValue);
	                            product.setTitle(titleValue);
	                            product.setSubject(subjectValue);
	                            product.setHandle(handleValue);
	                            product.setOrder(orderValue);
	                            product.setUnit("EA");
	                            product.setProductIndex(index);
	                            product.setBigSort(productBigSortRepository.findById(bigValue)
	                                    .orElseThrow(() -> new RuntimeException("BigSort not found")));
	                            product.setMiddleSort(productMiddleSortRepository.findById(middleValue)
	                                    .orElseThrow(() -> new RuntimeException("MiddleSort not found")));
	                            productRepository.save(product);
	                        } catch (Exception e) {
	                            e.printStackTrace();
	                            throw new RuntimeException(e);
	                        }
	                        return null;
	                    });
	                }
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    });

	    try {
	        // 기다리기 작업이 완료될 때까지 기다림
	        deleteFuture.get();
	        insertFuture.get();
	    } catch (Exception e) {
	        e.printStackTrace();
	        result.add("Error: " + e.getMessage());
	    }

	    executorService.shutdown();
	    result.add("Success");
	    return result;
	}


}
