package com.dev.HiddenBath.controller.api;

import java.time.LocalDate;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.HiddenBath.dto.access.AccessManagerDailyPageSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerPageLogSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerSearchResponse;
import com.dev.HiddenBath.service.access.SiteAccessAdminService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/admin/api/site/access")
@RequiredArgsConstructor
public class SiteAccessAdminApiController {

    private final SiteAccessAdminService siteAccessAdminService;

    @GetMapping("/stats")
    public ResponseEntity<AccessManagerSearchResponse> searchStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        return ResponseEntity.ok(siteAccessAdminService.search(fromDate, toDate));
    }

    @GetMapping("/daily-pages")
    public ResponseEntity<AccessManagerDailyPageSearchResponse> searchDailyPages(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(siteAccessAdminService.searchDailyPages(date));
    }

    @GetMapping("/page-logs")
    public ResponseEntity<AccessManagerPageLogSearchResponse> searchPageLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam String uri) {

        return ResponseEntity.ok(siteAccessAdminService.searchPageLogs(fromDate, toDate, uri));
    }

    @GetMapping("/excel")
    public ResponseEntity<ByteArrayResource> downloadExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        byte[] fileBytes = siteAccessAdminService.downloadExcel(fromDate, toDate);

        LocalDate finalToDate = (toDate != null) ? toDate : LocalDate.now();
        LocalDate finalFromDate = (fromDate != null) ? fromDate : finalToDate.minusDays(6);

        String fileName = "site-access-" + finalFromDate + "-to-" + finalToDate + ".xlsx";
        if (!StringUtils.hasText(fileName)) {
            fileName = "site-access.xlsx";
        }

        ByteArrayResource resource = new ByteArrayResource(fileBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentLength(fileBytes.length)
                .body(resource);
    }
}