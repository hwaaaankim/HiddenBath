package com.dev.HiddenBath.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
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

import com.dev.HiddenBath.dto.OnlineAgencyResponse;
import com.dev.HiddenBath.service.OnlineAgencyService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/admin/online-agency")
public class OnlineAgencyController {

    private final OnlineAgencyService service;
  
    /* ===== REST (AJAX) ===== */
    // 등록
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public OnlineAgencyResponse create(@RequestParam String name,
                                       @RequestParam(required = false) String contact,
                                       @RequestParam(required = false) String fax,
                                       @RequestParam(required = false, name = "homepageUrl") String homepageUrl,
                                       @RequestPart(required = false, name = "logo") MultipartFile logo) {
        return service.create(name, contact, fax, homepageUrl, logo);
    }

    // 조회(검색+페이지네이션)
    @GetMapping
    @ResponseBody
    public Map<String, Object> list(@RequestParam(defaultValue = "name") String type,
                                    @RequestParam(defaultValue = "") String keyword,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "16") int size) {

        Page<OnlineAgencyResponse> result = service.search(type, keyword, page, size);
        Map<String, Object> resp = new HashMap<>();
        resp.put("content", result.getContent());
        resp.put("page", result.getNumber());
        resp.put("size", result.getSize());
        resp.put("totalElements", result.getTotalElements());
        resp.put("totalPages", result.getTotalPages());
        return resp;
    }

    // 수정
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public OnlineAgencyResponse update(@PathVariable Long id,
                                       @RequestParam String name,
                                       @RequestParam(required = false) String contact,
                                       @RequestParam(required = false) String fax,
                                       @RequestParam(required = false, name = "homepageUrl") String homepageUrl,
                                       @RequestParam(defaultValue = "false") boolean removeLogo,
                                       @RequestPart(required = false, name = "logo") MultipartFile newLogo) {
        return service.update(id, name, contact, fax, homepageUrl, newLogo, removeLogo);
    }

    // 삭제
    @DeleteMapping("/{id}")
    @ResponseBody
    public Map<String, Object> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("result", "OK");
    }
}