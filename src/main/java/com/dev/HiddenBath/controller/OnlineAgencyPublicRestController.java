package com.dev.HiddenBath.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.HiddenBath.dto.OnlineAgencyResponse;
import com.dev.HiddenBath.service.OnlineAgencyService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/online-agency")
public class OnlineAgencyPublicRestController {

    private final OnlineAgencyService service;

    @GetMapping
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
}