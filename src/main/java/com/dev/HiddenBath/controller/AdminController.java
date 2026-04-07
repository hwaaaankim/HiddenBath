package com.dev.HiddenBath.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.dev.HiddenBath.config.KakaoConfig;
import com.dev.HiddenBath.dto.AgencyCreateRequest;
import com.dev.HiddenBath.dto.AgencyResponse;
import com.dev.HiddenBath.dto.AgencyUpdateRequest;
import com.dev.HiddenBath.model.Construction;
import com.dev.HiddenBath.model.Gallery;
import com.dev.HiddenBath.model.Popup;
import com.dev.HiddenBath.repository.ConstructionRepository;
import com.dev.HiddenBath.repository.GalleryRepository;
import com.dev.HiddenBath.service.AgencyService;
import com.dev.HiddenBath.service.ConstructionService;
import com.dev.HiddenBath.service.GalleryService;
import com.dev.HiddenBath.service.PopupService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 관리자 컨트롤러
 * - 화면 반환: 뷰 이름 반환
 * - 데이터 API: @ResponseBody 로 JSON 반환 (REST 컨트롤러 대체)
 */
@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    private final GalleryService galleryService;
    private final AgencyService agencyService;
    private final ConstructionService constructionService;
    private final PopupService popupService;
    private final KakaoConfig kakaoConfig;
    private final ObjectMapper objectMapper;
    private final GalleryRepository galleryRepository;
    private final ConstructionRepository constructionRepository;

    
    /* =========================
     *       화면(뷰) 라우팅
     * ========================= */

    @GetMapping({"/","", "/inquiryManager"})
    public String adminIndex(){
        return "administration/index";
    }

    @GetMapping("/inquiryDetail")
    public String inquiryDetail() {
        return "administration/client/inquiryDetail";
    }

    @GetMapping("/orderManager")
    public String orderManeger() {
        return "administration/client/orderManager";
    }

    @GetMapping("/orderDetail")
    public String orderDetail() {
        return "administration/client/orderDetail";
    }

    @GetMapping("/agencyManager")
    public String agencyManager(Model model) {
        model.addAttribute("kakaoJavascriptKey", kakaoConfig.getJavascriptKey());
        return "administration/client/agencyManager";
    }

    @GetMapping("/agencyInsertForm")
    public String agencyInsertForm(Model model) {
        model.addAttribute("kakaoJavascriptKey", kakaoConfig.getJavascriptKey());
        return "administration/client/agencyInsertForm";
    }

    @GetMapping("/noticeManager")
    public String noticeManager() {
        return "administration/site/noticeManager";
    }

    @GetMapping("/noticeInsertForm")
    public String noticeInsertForm() {
        return "administration/site/noticeInsertForm";
    }

    @GetMapping("/noticeCategoryManager")
    public String noticeCategoryManager() {
        return "administration/site/noticeCategoryManager";
    }

    @GetMapping("/instagramManager")
    public String instagramManager() {
        return "administration/site/instagramManager";
    }

    @GetMapping("/instagramInsertForm")
    public String instagramInsertForm() {
        return "administration/site/instagramInsertForm";
    }

    @GetMapping("/galleryManager")
    public String galleryManager(Model model) {
        List<Gallery> galleries = galleryRepository.findAllByOrderByIdDesc();
        model.addAttribute("galleries", galleries);
        return "administration/site/galleryManager";
    }

    @PostMapping("/galleryInsert")
    @ResponseBody
    public String galleryInsert(MultipartFile thumb, MultipartFile gallery) throws IOException {
        galleryService.insertGallery(thumb, gallery);
        String msg = "갤러리 이미지가 등록 되었습니다.";
        return scriptAlertRedirect(msg, "/admin/galleryManager");
    }

    @PostMapping("/galleryUpdate/{id}")
    @ResponseBody
    public String galleryUpdate(@PathVariable Long id, MultipartFile thumb, MultipartFile gallery) throws IOException {
        if ((thumb == null || thumb.isEmpty()) && (gallery == null || gallery.isEmpty())) {
            return scriptAlertRedirect("변경할 이미지가 없습니다.", "/admin/galleryManager");
        }
        galleryService.updateGalleryImages(id, thumb, gallery);
        return scriptAlertRedirect("이미지가 수정되었습니다.", "/admin/galleryManager");
    }

    /** 개별 삭제 (DB + 파일) */
    @PostMapping("/galleryDelete/{id}")
    @ResponseBody
    public String galleryDelete(@PathVariable Long id) {
        galleryService.deleteGallery(id);
        return scriptAlertRedirect("삭제되었습니다.", "/admin/galleryManager");
    }
    
    private String scriptAlertRedirect(String msg, String url) {
        StringBuilder sb = new StringBuilder();
        sb.append("<script>");
        if (StringUtils.hasText(msg)) {
            sb.append("alert('").append(msg.replace("'", "\\'")).append("');");
        }
        sb.append("location.href='").append(url).append("';");
        sb.append("</script>");
        return sb.toString();
    }

    /** 메인(리스트/업로드/수정/삭제 통합) */
    @GetMapping("/constructionManager")
    public String constructionManager(Model model) {
        List<Construction> list = constructionRepository.findAllByOrderByIdDesc();
        model.addAttribute("constructions", list);
        return "administration/site/constructionManager";
    }

    /** 신규 등록 */
    @PostMapping("/constructionInsert")
    @ResponseBody
    public String constructionInsert(MultipartFile thumb, MultipartFile construction) throws IOException {
        constructionService.insertConstruction(thumb, construction);
        return scriptAlertRedirect("시공사례 이미지가 등록되었습니다.", "/admin/constructionManager");
    }

    /** 개별 수정(썸네일/원본) */
    @PostMapping("/constructionUpdate/{id}")
    @ResponseBody
    public String constructionUpdate(@PathVariable Long id, MultipartFile thumb, MultipartFile construction) throws IOException {
        if ((thumb == null || thumb.isEmpty()) && (construction == null || construction.isEmpty())) {
            return scriptAlertRedirect("변경할 이미지가 없습니다.", "/admin/constructionManager");
        }
        constructionService.updateConstructionImages(id, thumb, construction);
        return scriptAlertRedirect("이미지가 수정되었습니다.", "/admin/constructionManager");
    }

    /** 개별 삭제(DB+파일) */
    @PostMapping("/constructionDelete/{id}")
    @ResponseBody
    public String constructionDelete(@PathVariable Long id) {
        constructionService.deleteConstruction(id);
        return scriptAlertRedirect("삭제되었습니다.", "/admin/constructionManager");
    }

    @GetMapping("/popupManager")
    public String popupManager() {
        return "administration/site/popupManager";
    }

    // ===== REST APIs =====
    @GetMapping("/api/popups")
    @ResponseBody
    public List<Popup> list() {
        return popupService.listAll();
    }

    @PostMapping("/api/popups")
    @ResponseBody
    public ResponseEntity<Popup> create(
            @RequestParam("image") MultipartFile image,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Popup p = popupService.create(image, startDate, endDate);
        return ResponseEntity.ok(p);
    }

    @PutMapping("/api/popups/{id}")
    @ResponseBody
    public ResponseEntity<Popup> update(
            @PathVariable Long id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Popup p = popupService.update(id, image, startDate, endDate);
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/api/popups/{id}")
    @ResponseBody
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        popupService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/emailSendManager")
    public String emailSendManager() {
        return "administration/site/emailSendManager";
    }

    @GetMapping("/emailReceiveManager")
    public String emailReceiveManager() {
        return "administration/site/emailReceiveManager";
    }

    @GetMapping("/smsSendManager")
    public String smsSendManager() {
        return "administration/site/smsSendManager";
    }

    @GetMapping("/smsReceiveManager")
    public String smsReceiveManager() {
        return "administration/site/smsReceiveManager";
    }

    @GetMapping("/siteAccessManager")
    public String siteAccessManager() {
        return "administration/analytics/accessManager";
    }

    @GetMapping("/siteAccessDetail")
    public String siteAccessDetail() {
        return "administration/analytics/siteAccessDetail";
    }

    @GetMapping("/siteAnalytics")
    public String siteAnalytics() {
        return "administration/analytics/siteAnalytics";
    }

    /* =========================
     *      대리점 관리 API
     *  (ResponseBody = JSON)
     * ========================= */

    /**
     * 대리점 목록 검색
     *  - type: name | contact (기본 name)
     *  - keyword: 부분일치 (contain)
     *  - page: 0-base
     *  - size: 10/30/50/100 등
     */
    @GetMapping(value = "/api/agencies", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Page<AgencyResponse>> listAgencies(
            @RequestParam(defaultValue = "name") String type,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<AgencyResponse> result = agencyService.search(type, keyword, pageable);
        return ResponseEntity.ok(result);
    }

    /** 대리점 단건 조회 */
    @GetMapping(value = "/api/agencies/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<AgencyResponse> getAgency(@PathVariable Long id) {
        return ResponseEntity.ok(agencyService.get(id));
    }

    /**
     * 대리점 등록
     * - multipart/form-data
     *   - part name="form" : AgencyCreateRequest (JSON)
     *   - part name="icon" : MultipartFile (선택)
     */
    @PostMapping(
        value = "/api/agencies",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AgencyResponse> createAgency(
            @RequestPart("form") @Valid AgencyCreateRequest form,
            @RequestPart(value = "icon", required = false) MultipartFile icon
    ) throws Exception {

        // ★ 수신 값 로깅 (문자열/좌표/연락처)
        log.info("[AgencyCreate] name='{}', sido='{}', sigungu='{}', bname='{}', postcode='{}'",
                form.getName(), form.getSido(), form.getSigungu(), form.getBname(), form.getPostcode());
        log.info("[AgencyCreate] road='{}', jibun='{}', detail='{}'",
                form.getRoadAddress(), form.getJibunAddress(), form.getAddressDetail());
        log.info("[AgencyCreate] lat={}, lng={}", form.getLatitude(), form.getLongitude());
        log.info("[AgencyCreate] tel='{}', mobile='{}', fax='{}', kakao='{}', staff='{}'",
                form.getTel(), form.getMobile(), form.getFax(), form.getKakaoTalkLink(), form.getStaffName());
        if (icon != null) {
            log.info("[AgencyCreate] icon: name='{}', size={}, contentType={}",
                    icon.getOriginalFilename(), icon.getSize(), icon.getContentType());
        } else {
            log.info("[AgencyCreate] icon: null");
        }

        //(JSON 전체 원하면)
        log.debug("[AgencyCreate] JSON payload: {}", objectMapper.writeValueAsString(form));

        AgencyResponse res = agencyService.create(form, icon);
        return ResponseEntity.ok(res);
    }

    /**
     * 대리점 수정
     * - multipart/form-data
     *   - part name="form" : AgencyUpdateRequest (JSON)
     *   - part name="icon" : MultipartFile (선택, 교체 시 기존 파일 삭제)
     */
    @PutMapping(value = "/api/agencies/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<AgencyResponse> updateAgency(
            @PathVariable Long id,
            @RequestPart("form") AgencyUpdateRequest form,
            @RequestPart(value = "icon", required = false) MultipartFile icon
    ) throws Exception {
        return ResponseEntity.ok(agencyService.update(id, form, icon));
    }

    /** 대리점 삭제 (아이콘 파일도 함께 정리) */
    @DeleteMapping(value = "/api/agencies/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteAgency(@PathVariable Long id) {
        agencyService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    
    @GetMapping("/onlineAgencyManager")
    public String onlineAgencyManager() {
    	
    	return "administration/client/onlineAgencyManager";
    }
}
