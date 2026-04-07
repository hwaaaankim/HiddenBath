package com.dev.HiddenBath.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dev.HiddenBath.dto.MenuDTO;
import com.dev.HiddenBath.model.Client;
import com.dev.HiddenBath.model.product.MiddleSort;
import com.dev.HiddenBath.model.product.Product;
import com.dev.HiddenBath.repository.ConstructionRepository;
import com.dev.HiddenBath.repository.GalleryRepository;
import com.dev.HiddenBath.repository.product.ProductBigSortRepository;
import com.dev.HiddenBath.repository.product.ProductColorRepository;
import com.dev.HiddenBath.repository.product.ProductMiddleSortRepository;
import com.dev.HiddenBath.repository.product.ProductRepository;
import com.dev.HiddenBath.repository.product.ProductTagRepository;
import com.dev.HiddenBath.service.ClientService;
import com.dev.HiddenBath.service.GalleryService;
import com.dev.HiddenBath.service.PopupService;
import com.dev.HiddenBath.service.product.ProductService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class IndexController {

	private final ProductRepository productRepository;
	private final ProductBigSortRepository productBigSortRepository;
	private final ProductMiddleSortRepository productMiddleSortRepository;
	private final ProductColorRepository productColorRepository;
	private final ProductTagRepository productTagRepository;
	private final GalleryRepository galleryRepository;
	private final ConstructionRepository constructionRepository;
	private final GalleryService galleryService;
	private final ProductService productService;
	private final PopupService popupService;

	@Autowired
	ClientService clientService;

	@ModelAttribute("menuList")
	public MenuDTO menuList(MenuDTO menuDto) {

		menuDto.setBigSortList(productBigSortRepository.findAllByOrderByBigSortIndexAsc());

		return menuDto;
	}

	@GetMapping("/loginForm")
	public String loginForm() {

		return "administration/login";
	}

	@PostMapping("/signinProcess")
	public String loginProcess() {

		return "administration/index";
	}

	@GetMapping({ "/", "", "/index" })
	public String home(HttpServletRequest request, HttpSession session, Model model) {
		System.out.println(session.getAttribute("user"));
		model.addAttribute("construction", constructionRepository.findAll());
		model.addAttribute("one", galleryService.getGalleriesInTwoHalves().get(0));
		model.addAttribute("two", galleryService.getGalleriesInTwoHalves().get(1));

		// === 오늘 기준 유효 팝업 추가 ===
		model.addAttribute("popups", popupService.findActivePopups(LocalDate.now()));

		return "front/index";
	}

	@PostMapping("/close")
	@ResponseBody
	public void close(@RequestBody String sessionValue, HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.removeAttribute("user");
	}

	@GetMapping("/about")
	public String about() {

		return "front/about";
	}

	@GetMapping("/history")
	public String history() {

		return "front/history";
	}

	@GetMapping("/exampleGallery")
	public String exampleGallery(Model model) {

		model.addAttribute("con", constructionRepository.findAll());
		return "front/construction";
	}

	@GetMapping("/imageGallery")
	public String imageGallery(Model model) {
		model.addAttribute("gal", galleryRepository.findAll());
		return "front/imageGallery";
	}

	@GetMapping("/notice")
	public String notice() {

		return "front/notice";
	}

	@GetMapping("/catalog")
	public String catalog() {

		return "front/catalog";
	}

	@GetMapping("/2022")
	public String catalog2022() {

		return "front/catalog/2022";
	}

	@GetMapping("/2023")
	public String catalog2023() {

		return "front/catalog/2023";
	}

	@GetMapping("/2023New")
	public String catalog2023New() {

		return "front/catalog/2023New";
	}

	@GetMapping("/2024")
	public String catalog2024() {

		return "front/catalog/2024";
	}

	@GetMapping("/2025")
	public String catalog2025() {

		return "front/catalog/2025";
	}

	@GetMapping("/noticeDetail")
	public String noticeDetail() {

		return "front/noticeDetail";
	}

	@GetMapping("/contact")
	public String contact() {

		return "front/contact";
	}

	@PostMapping("/searchMiddleSort")
	@ResponseBody
	public List<MiddleSort> searchMiddleSort(Model model, Long bigId) {

		return productMiddleSortRepository.findAllByBigSort(productBigSortRepository.findById(bigId).get());
	}

	@RequestMapping(value = "/productList/{id}", method = { RequestMethod.GET, RequestMethod.POST })
	public String productList(Model model, @PathVariable Long id,
			@RequestParam(required = false, defaultValue = "0") Long middleId,
			@RequestParam(required = false, defaultValue = "0") Long tagId,
			@RequestParam(required = false, defaultValue = "0") Long colorId,
			@PageableDefault(size = 10) Pageable pageable) {
		Page<Product> products = null;
		if (id == 7l) {
			products = productRepository.findAllByOrderByProductIndexAsc(pageable);
			List<MiddleSort> middles = new ArrayList<MiddleSort>();
			MiddleSort sort = new MiddleSort();
			sort.setName("전체제품조회");
			sort.setId(0l);
			middles.add(sort);
			model.addAttribute("middleSortName", "분류전체");
			model.addAttribute("middleSorts", middles);
		} else {
			products = productService.getProductsByCriteria(tagId, colorId, middleId, id, pageable);
			model.addAttribute("middleSorts",
					productMiddleSortRepository.findAllByBigSort(productBigSortRepository.findById(id).get()));
		}
		int startPage = Math.max(1, products.getPageable().getPageNumber() - 4);
		int endPage = Math.min(products.getTotalPages(), products.getPageable().getPageNumber() + 4);
		model.addAttribute("startPage", startPage);
		model.addAttribute("endPage", endPage);
		model.addAttribute("bigSortName", productBigSortRepository.findById(id).get().getName());
		model.addAttribute("products", products);
		model.addAttribute("tagId", tagId);
		model.addAttribute("colorId", colorId);
		model.addAttribute("middleSortId", middleId);
		model.addAttribute("bigSortId", id);
		model.addAttribute("bigSorts", productBigSortRepository.findAll());
		model.addAttribute("tags", productTagRepository.findAll());
		model.addAttribute("colors", productColorRepository.findAll());

		return "front/productList";
	}

	@GetMapping("/productDetail/{id}")
	public String productDetail(@PathVariable Long id, Model model) {

		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
		List<Product> relatedProducts = productService.getRandomProductsByTag(product);

		model.addAttribute("product", product);
		model.addAttribute("relatedProducts", relatedProducts);
		return "front/productDetail";
	}

	@GetMapping("/productDetailAdvanced/{id}")
	public String productDetailAdvanced(@PathVariable Long id, Model model) {

		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
		List<Product> relatedProducts = productService.getRandomProductsByTag(product);
		int centerRotationNumber = Math.round(product.getProductRotationNumber() / 2.0f);
		model.addAttribute("centerRotationNumber", centerRotationNumber);
		model.addAttribute("product", product);
		model.addAttribute("relatedProducts", relatedProducts);
		return "front/productDetailAdvanced";
	}

	@PostMapping("/clientInsert")
	@ResponseBody
	public String clientInsert(Client client) {

		clientService.clientInsert(client);

		StringBuffer sb = new StringBuffer();
		String msg = "문의 주셔서 감사합니다. 빠르게 연락드리도록 하겠습니다.";

		sb.append("alert('" + msg + "');");
		sb.append("location.href='/index'");
		sb.append("</script>");
		sb.insert(0, "<script>");

		return sb.toString();
	}

	@PostMapping("/searchKeword")
	public String searchKeword(Model model, String keyword) {
		model.addAttribute("name", productRepository.findByNameContaining(keyword));
		model.addAttribute("code", productRepository.findByProductCodeContaining(keyword));
		return "front/search";
	}

	@GetMapping("/address")
	public String address() {

		return "front/address";
	}
}
