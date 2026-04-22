package com.dev.HiddenBath.service.access;

import java.time.LocalDate;

import com.dev.HiddenBath.dto.access.AccessManagerDailyPageSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerPageLogSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerSearchResponse;

public interface SiteAccessAdminService {

    AccessManagerSearchResponse search(LocalDate fromDate, LocalDate toDate);

    AccessManagerDailyPageSearchResponse searchDailyPages(LocalDate date);

    AccessManagerPageLogSearchResponse searchPageLogs(LocalDate fromDate, LocalDate toDate, String uri);

    byte[] downloadExcel(LocalDate fromDate, LocalDate toDate);
}