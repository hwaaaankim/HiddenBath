package com.dev.HiddenBath.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.dto.ProductDTO;
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
import com.dev.HiddenBath.service.ExcelUploadService;
import com.dev.HiddenBath.service.RefactoringService;
import com.dev.HiddenBath.service.ZipService;
import com.dev.HiddenBath.service.product.ProductBigSortService;
import com.dev.HiddenBath.service.product.ProductColorService;
import com.dev.HiddenBath.service.product.ProductFileService;
import com.dev.HiddenBath.service.product.ProductImageService;
import com.dev.HiddenBath.service.product.ProductMiddleSortService;
import com.dev.HiddenBath.service.product.ProductOptionService;
import com.dev.HiddenBath.service.product.ProductService;
import com.dev.HiddenBath.service.product.ProductSizeService;
import com.dev.HiddenBath.service.product.ProductTagService;
import com.dev.HiddenBath.utils.RotationUtils;

@Controller
@RequestMapping("/admin")
public class ProductAdminController {
	
	@Autowired
	ProductSizeRepository productSizeRepository;
	
	@Autowired
	ProductSizeService productSizeService;
	
	@Autowired
	ProductColorRepository productColorRepository;
	
	@Autowired
	ProductColorService productColorService;
	
	@Autowired
	ProductBigSortRepository productBigSortRepository;
	
	@Autowired
	ProductBigSortService productBigSortService;
	
	@Autowired
	ProductMiddleSortRepository productMiddleSortRepository;
	
	@Autowired
	ProductMiddleSortService productMiddleSortService;
	
	@Autowired
	ProductTagRepository productTagRepository;
	
	@Autowired
	ProductOptionRepository productOptionRepository;
	
	@Autowired
	ProductOptionService productOptionService;
	
	@Autowired
	ProductTagService productTagService;
	
	@Autowired
	ProductRepository productRepository;
	
	@Autowired
	ProductService productService;
	
	@Autowired
	ProductImageService productImageService;
	
	@Autowired
	ProductFileService productFileService;
	
	@Autowired
	ProductFileRepository productFileRepository;
	
	@Autowired
	ProductImageRepository productImageRepository;
	
	@Autowired
	ExcelUploadService excelUploadService;
	
	@Autowired
	ZipService zipService;
	
	@Autowired
	RotationUtils rotationUtils;
	
	@Autowired
	RefactoringService refactoringService;
	
	@GetMapping("/code-duplicate")
	@ResponseBody
	public boolean checkProductCodeDuplicate(
	        @RequestParam String code,
	        @RequestParam(required = false) Long productId // 추가 (없으면 null)
	) {
	    if (productId != null) {
	        // 수정 시: 본인 id의 상품은 중복 아님 처리
	        return productService.isProductCodeDuplicate(code, productId);
	    } else {
	        // 신규 등록 등 기존 방식
	        return productService.isProductCodeDuplicate(code);
	    }
	}
	
	@PostMapping("/resetZipUpload")
	@ResponseBody
	public void resetZipUpload(
			MultipartFile file,
			Model model
			) throws IOException {
		rotationUtils.processUpload(file);
	}
	
	@PostMapping("/refactoringZipUpload")
    public ResponseEntity<Resource> refactoringZipUpload(@RequestParam("file") MultipartFile file) throws IOException {
        // 파일 처리
        String zipFilePath = refactoringService.refactorAndZip(file);

        // 처리 완료 후 파일 다운로드
        File zipFile = new File(zipFilePath);
        Resource resource = new FileSystemResource(zipFile);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + zipFile.getName());

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(zipFile.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

	@PostMapping("/resetExcelUpload")
	@ResponseBody
	public List<String> addExcelUpload(MultipartFile file, Model model) throws IOException {
	    return excelUploadService.uploadExcel(file);
	}
    
	@PostMapping("/updateExcelUpload")
	@ResponseBody
    public void updateExcelUpload(@RequestParam("file") MultipartFile file) throws IOException {
		excelUploadService.updateProductsFromExcel(file);
    }
	
	@GetMapping("/productCategoryManager")
	public String productCategoryManager(
			Model model
			) {
		model.addAttribute("middle", productMiddleSortRepository.findAll());
		model.addAttribute("big", productBigSortRepository.findAll());
		return "administration/product/productCategoryManager";
	}

	@PostMapping("/productBigSortInsert")
	@ResponseBody
	public String productBigSortInsert(
			String bigCategories
			) {
		String[] arr = bigCategories.split(",");
		
		for(String big : arr) {
			int index = 1;
			if(productBigSortRepository.findFirstIndex().isPresent()) {
				index = productBigSortRepository.findFirstIndex().get() + 1;
			}
			BigSort b = new BigSort();
			b.setBigSortIndex(index);
			b.setName(big);
			productBigSortRepository.save(b);
		}
		StringBuffer sb = new StringBuffer();
		String msg = "대분류가 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productCategoryManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productBigSortDelete")
	@ResponseBody
	public String productBigSortDelete(
			@RequestParam Long[] bigSortDeleteSelect
			) {
		try {
			productBigSortService.deleteProductBigSort(bigSortDeleteSelect);
			StringBuffer sb = new StringBuffer();
			String msg = "대분류가 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productCategoryManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}catch(Exception e) {
			StringBuffer sb = new StringBuffer();
			String msg = "대분류가 등록된 중분류, 제품이 존재하는 경우 대분류를 삭제할 수 없습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productCategoryManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}
	}
	
	@PostMapping("/productMiddleSortInsert")
	@ResponseBody
	public String productMiddleSortInsert(
			Long bigSortId,
			String middleCategories
			) {
		String[] arr = middleCategories.split(",");
		
		for(String middle : arr) {
			int index = 1;
			if(productMiddleSortRepository.findFirstIndex().isPresent()) {
				index = productMiddleSortRepository.findFirstIndex().get() + 1;
			}
			MiddleSort m = new MiddleSort();
			m.setBigSort(productBigSortRepository.findById(bigSortId).get());
			m.setMiddleSortIndex(index);
			m.setName(middle);
			productMiddleSortRepository.save(m);
		}
		StringBuffer sb = new StringBuffer();
		String msg = "중분류가 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productCategoryManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productMiddleSortDelete")
	@ResponseBody
	public String productMiddleSortDelete(
			@RequestParam Long[] middleSortDeleteSelect
			) {
		try {
			productMiddleSortService.deleteProductMiddleSort(middleSortDeleteSelect);
			StringBuffer sb = new StringBuffer();
			String msg = "중분류가 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productCategoryManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}catch(Exception e) {
			StringBuffer sb = new StringBuffer();
			String msg = " 중분류가 등록된 제품이 존재하는 경우 중분류를 삭제할 수 없습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productCategoryManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}
	}
	
	@GetMapping("/productManager")
	public String productManager(
			@RequestParam(value = "bigId", required = false) Long bigId,
			@RequestParam(value = "middleId", required = false) Long middleId,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
			Model model) {

		Page<Product> productPage = productService.getFilteredProductList(bigId, middleId, keyword, page, size);

		model.addAttribute("productPage", productPage);
		model.addAttribute("size", size);
		model.addAttribute("page", page);
		model.addAttribute("bigId", bigId);
		model.addAttribute("middleId", middleId);
		model.addAttribute("keyword", keyword);
		model.addAttribute("bigList", productService.getAllBigSorts());

		// 선택된 대분류에 속한 중분류 목록
		List<MiddleSort> middleList = (bigId != null)
				? productService.getMiddleSortsByBigSort(bigId)
				: new ArrayList<>();
		model.addAttribute("middleList", middleList);

		return "administration/product/productManager";
	}
	
	@GetMapping("/productDetail/{id}")
    public String productManager(
            @PathVariable("id") Long id,
            Model model
    ) {
        Product product = productService.findProductWithDetails(id);
        if (product == null) {
            model.addAttribute("errorMessage", "해당 제품을 찾을 수 없습니다.");
            return "administration/product/productDetail"; // 또는 에러 안내 페이지
        }

        // 대분류 전체
        List<BigSort> bigsorts = productBigSortRepository.findAll();

        // 중분류 (해당 대분류에 속한 것만)
        List<MiddleSort> middlesorts = productMiddleSortRepository.findAllByBigSort(product.getBigSort());

        // 멀티셀렉트용 데이터
        List<ProductSize> sizes = productSizeRepository.findAll();
        List<ProductColor> colors = productColorRepository.findAll();
        List<ProductOption> options = productOptionRepository.findAll();
        List<ProductTag> tags = productTagRepository.findAll();
        model.addAttribute("product", product);
        model.addAttribute("bigsorts", bigsorts);
        model.addAttribute("middlesorts", middlesorts);
        model.addAttribute("sizes", sizes);
        model.addAttribute("colors", colors);
        model.addAttribute("options", options);
        model.addAttribute("tags", tags);

        return "administration/product/productDetail";
    }
	
	@DeleteMapping("/productDelete/{id}")
	@ResponseBody
	public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
		try {
			productService.deleteProduct(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
		}
	}
	
	@GetMapping("/productInsertForm")
	public String productInsertForm(
			Model model
			) {
		List<BigSort> b = productBigSortRepository.findAll();
		if(b.size()<1) {
			BigSort bs = new BigSort();
			bs.setName("분류를 등록 해 주세요");
			bs.setId(0L);
			b.add(bs);
		}
		
		List<ProductOption> o = productOptionRepository.findAll();
		if(o.size()<1) {
			ProductOption ot = new ProductOption();
			ot.setProductOptionText("옵션을 등록 해 주세요");
			ot.setId(0L);
			o.add(ot);
		}
		
		List<ProductColor> c = productColorRepository.findAll();
		if(c.size()<1) {
			ProductColor cr = new ProductColor();
			cr.setProductColorSubject("색상을 등록 해 주세요");
			cr.setId(0L);
			c.add(cr);
		}
		
		List<ProductSize> s = productSizeRepository.findAll();
		if(s.size()<1) {
			ProductSize ps = new ProductSize();
			ps.setProductSizeText("사이즈를 입력 해 주세요");
			ps.setId(0L);
			s.add(ps);
		}
		
		List<ProductTag> t = productTagRepository.findAll();
		if(t.size()<1) {
			ProductTag pt = new ProductTag();
			pt.setProductTagText("태그를 등록 해 주세요");
			pt.setId(0L);
			t.add(pt);
		}
		
		model.addAttribute("options", o);
		model.addAttribute("tags", t);
		model.addAttribute("sizes", s);
		model.addAttribute("colors", c);
		model.addAttribute("bigsorts", b);
		return "administration/product/productInsertForm";
	}
	
	@PostMapping("/searchMiddleSort")
	@ResponseBody
	public List<MiddleSort> searchMiddleSort(
			Model model, 
			Long bigId
			) {

		return productMiddleSortRepository.findAllByBigSort(productBigSortRepository.findById(bigId).get());
	}
	
	@PostMapping("/productInsert")
	@ResponseBody
	public String productInsert(
			ProductDTO dto
			) throws IllegalStateException, IOException {
		
		Product savedProduct = productService.productInsert(dto);
		
		if(dto.getSlideImages() != null 
				&& !dto.getSlideImages().isEmpty() 
				&& !dto.getSlideImages().get(0).isEmpty()) {
			productImageService.imageUpload(savedProduct, dto.getSlideImages());
		}
		
		if(dto.getFiles() != null
				&& !dto.getFiles().isEmpty()
				&& !dto.getFiles().get(0).isEmpty()) {
			productFileService.fileUpload(savedProduct, dto.getFiles());
		}
		StringBuffer sb = new StringBuffer();
		String msg = "제품이 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productUpdate")
    public String updateProduct(
            @RequestParam("productId") Long productId,
            @RequestParam("productName") String name,
            @RequestParam("productCode") String code,
            @RequestParam(value = "productTitle", required = false) String title,
            @RequestParam(value = "subject", required = false) String subject,
            @RequestParam("bigSort") Long bigSortId,
            @RequestParam("middleSort") Long middleSortId,
            @RequestParam("order") Boolean order,
            @RequestParam("handle") Boolean handle,
            @RequestParam(value = "sizes", required = false) List<Long> sizeIds,
            @RequestParam(value = "colors", required = false) List<Long> colorIds,
            @RequestParam(value = "options", required = false) List<Long> optionIds,
            @RequestParam(value = "tags", required = false) List<Long> tagIds,
            // 이미지
            @RequestParam(value = "productImage", required = false) MultipartFile productImage,
            @RequestParam(value = "slideImages", required = false) List<MultipartFile> slideImages,
            @RequestParam(value = "files", required = false) MultipartFile drawingImage,
            // 삭제 관련
            @RequestParam(value = "deleteRepImage", required = false, defaultValue = "false") Boolean deleteRepImage,
            @RequestParam(value = "deleteDrawingImage", required = false, defaultValue = "false") Boolean deleteDrawingImage,
            @RequestParam(value = "deleteSlideImageIds", required = false) String deleteSlideImageIds,
            Model model
    ) {

        try {
            // 완성형 서비스 호출
            productService.updateProduct(
                    productId,
                    name,
                    code,
                    title,
                    subject,
                    bigSortId,
                    middleSortId,
                    order,
                    handle,
                    sizeIds,
                    colorIds,
                    optionIds,
                    tagIds,
                    productImage,
                    slideImages,
                    drawingImage,
                    deleteRepImage,
                    deleteDrawingImage,
                    deleteSlideImageIds
            );
        } catch (Exception e) {
            // 예외처리 (로그, 메시지 등)
            e.printStackTrace();
            model.addAttribute("errorMsg", "제품 수정에 실패했습니다: " + e.getMessage());
            return "redirect:/admin/productManager"; // 에러 시 상세페이지로 이동(상황에 따라 조정)
        }

        // 폼으로 리다이렉트 (리스트페이지 등)
        return "redirect:/admin/productManager";
    }
	
	@GetMapping("/productTagManager")
	public String productTagManager(
			Model model
			) {
		model.addAttribute("tag", productTagRepository.findAll());
		return "administration/product/productTagManager";
	}
	
	@PostMapping("/productTagInsert")
	@ResponseBody
	public String productTagInsert(
			String productTags
			) {
		String[] arr = productTags.split(",");
		
		for(String tag : arr) {
			if(tag.contains("&amp;")) {
				tag = tag.replace("&amp;", "&");
			}
			ProductTag t = new ProductTag();
			t.setProductTagText(tag);
			productTagRepository.save(t);
		}
		StringBuffer sb = new StringBuffer();
		String msg = "제품 태그가 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productTagManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productTagDelete")
	@ResponseBody
	public String productTagDelete(
			@RequestParam Long[] tagDeleteSelect
			) {
		try {
			productTagService.deleteProductTag(tagDeleteSelect);
			StringBuffer sb = new StringBuffer();
			String msg = "태그가 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productTagManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}catch(Exception e) {
			StringBuffer sb = new StringBuffer();
			String msg = "에러가 발생하였습니다. 다시 시도해주세요.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productTagManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}
	}
	
	@GetMapping("/productIndexManager")
	public String productIndexManager(
	        @RequestParam(value = "bigId", required = false) Long bigId,
	        @RequestParam(value = "middleId", required = false) Long middleId,
	        Model model
	) {
	    // 대분류 전체 조회
	    List<BigSort> bigSortList = productBigSortRepository.findAll();
	    model.addAttribute("bigSortList", bigSortList);

	    // 분류조건별 index 오름차순 전체 리스트
	    List<Product> productList = productRepository.findAllBySortsNoPaging(bigId, middleId);
	    model.addAttribute("productList", productList);
	    model.addAttribute("bigId", bigId);
	    model.addAttribute("middleId", middleId);

	    return "administration/product/productIndexManager";
	}

	@PostMapping("/productIndexChange")
	@ResponseBody
	public String productIndexChange(@RequestBody Map<String, List<Long>> param) {
	    List<Long> oldIdList = param.get("oldIdList");
	    List<Long> newIdList = param.get("newIdList");
	    try {
	        productService.exchangeProductIndexes(oldIdList, newIdList);
	        return "ok";
	    } catch(Exception e) {
	        e.printStackTrace();
	        return "error: " + e.getMessage();
	    }
	}

	@GetMapping("/productOverallManager")
	public String productOverallManager() {
		
		return "administration/product/productOverallManager";
	}
	
	@GetMapping("/productAddManager")
	public String productAddManager() {
		
		return "administration/product/productAddManager";
	}
	
	@GetMapping("/productResetManager")
	public String productResetManager() {
		
		return "administration/product/productResetManager";
	}
	
	@GetMapping("/productSizeManager")
	public String productSizeManager(
			Model model
			) {
		model.addAttribute("sizes", productSizeRepository.findAll());
		return "administration/product/productSizeManager";
	}
	
	@PostMapping("/productSizeInsert")
	@ResponseBody
	public String productSizeInsert(
			String size
			) {
		String[] arr = size.split(",");
		productSizeService.insertProductSize(arr);
		StringBuffer sb = new StringBuffer();
		String msg = "사이즈가 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productSizeManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productSizeDelete")
	@ResponseBody
	public String productSizeDelete(
			@RequestParam Long[] text
			) {
		try {
			productSizeService.deleteProductSize(text);
			StringBuffer sb = new StringBuffer();
			String msg = "사이즈가 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productSizeManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}catch(Exception e) {
			StringBuffer sb = new StringBuffer();
			String msg = "에러가 발생하였습니다. 다시 시도해주세요.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productSizeManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}
	}
	
	@GetMapping("/productOptionManager")
	public String productOptionManager(
			Model model
			) {
		
		model.addAttribute("options", productOptionRepository.findAll());
		return "administration/product/productOptionManager";
	}
	
	@PostMapping("/productOptionInsert")
	@ResponseBody
	public String productOptionInsert(
			String productOptions
			) {
		String[] arr = productOptions.split(",");
		
		for(String tag : arr) {
			if(tag.contains("&amp;")) {
				tag = tag.replace("&amp;", "&");
			}
			ProductOption o = new ProductOption();
			o.setProductOptionText(tag);
			productOptionRepository.save(o);
		}
		StringBuffer sb = new StringBuffer();
		String msg = "제품 옵션이 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productOptionManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productOptionDelete")
	@ResponseBody
	public String productOptionDelete(
			@RequestParam Long[] optionDeleteSelect
			) {
		try {
			productOptionService.deleteProductOption(optionDeleteSelect);
			StringBuffer sb = new StringBuffer();
			String msg = "옵션이 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productOptionManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}catch(Exception e) {
			StringBuffer sb = new StringBuffer();
			String msg = "에러가 발생하였습니다. 다시 시도해주세요.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productOptionManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}
	}	
	
	@GetMapping("/productColorManager")
	public String productColorManager(
			Model model
			) {
		
		model.addAttribute("colors", productColorRepository.findAll());
		return "administration/product/productColorManager";
	}
	
	@PostMapping("/productColorInsert")
	@ResponseBody
	public String productColorInsert(
			String colorName,
			MultipartFile colorFile
			) throws IOException {
		productColorService.insertProductColor(colorName, colorFile);
		StringBuffer sb = new StringBuffer();
		String msg = "색상이 등록 되었습니다.";
		
		sb.append("alert('" + msg + "');");
		sb.append("location.href='/admin/productColorManager'");
		sb.append("</script>");
		sb.insert(0, "<script>");
		
		return sb.toString();
	}
	
	@PostMapping("/productColorDelete")
	@ResponseBody
	public String productColorDelete(
			@RequestParam Long[] text
			) {
		try {
			productColorService.deleteProductColor(text);
			StringBuffer sb = new StringBuffer();
			String msg = "색상이 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productColorManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}catch(Exception e) {
			StringBuffer sb = new StringBuffer();
			String msg = "색상이 삭제 되었습니다.";
			
			sb.append("alert('" + msg + "');");
			sb.append("location.href='/admin/productColorManager'");
			sb.append("</script>");
			sb.insert(0, "<script>");
			
			return sb.toString();
		}
	}
}
