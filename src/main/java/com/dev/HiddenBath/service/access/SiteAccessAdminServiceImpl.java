package com.dev.HiddenBath.service.access;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.HiddenBath.dto.access.AccessDailyPageViewCountRow;
import com.dev.HiddenBath.dto.access.AccessDailyVisitorCountRow;
import com.dev.HiddenBath.dto.access.AccessManagerDailyPageSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerDailyRowResponse;
import com.dev.HiddenBath.dto.access.AccessManagerPageLogResponse;
import com.dev.HiddenBath.dto.access.AccessManagerPageLogSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerSearchResponse;
import com.dev.HiddenBath.dto.access.AccessManagerSummaryResponse;
import com.dev.HiddenBath.dto.access.AccessManagerTopPageResponse;
import com.dev.HiddenBath.dto.access.AccessPageAggregateRow;
import com.dev.HiddenBath.dto.access.AccessPageLogRow;
import com.dev.HiddenBath.repository.access.SiteDailyVisitorRepository;
import com.dev.HiddenBath.repository.access.SitePageViewRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SiteAccessAdminServiceImpl implements SiteAccessAdminService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final SiteDailyVisitorRepository siteDailyVisitorRepository;
    private final SitePageViewRepository sitePageViewRepository;

    @Override
    public AccessManagerSearchResponse search(LocalDate fromDate, LocalDate toDate) {
        DateRange range = resolveRange(fromDate, toDate);

        List<AccessDailyVisitorCountRow> dailyVisitorRows =
                siteDailyVisitorRepository.findDailyVisitorCounts(range.fromDate(), range.toDate());

        List<AccessDailyPageViewCountRow> dailyPageViewRows =
                sitePageViewRepository.findDailyPageViewCounts(range.fromDate(), range.toDate());

        Map<LocalDate, DailyAccumulator> dailyMap = new LinkedHashMap<>();
        LocalDate cursor = range.fromDate();
        while (!cursor.isAfter(range.toDate())) {
            dailyMap.put(cursor, new DailyAccumulator());
            cursor = cursor.plusDays(1);
        }

        for (AccessDailyVisitorCountRow row : dailyVisitorRows) {
            DailyAccumulator accumulator = dailyMap.get(row.getVisitDate());
            if (accumulator != null) {
                accumulator.visitorCount = row.getVisitorCount();
            }
        }

        for (AccessDailyPageViewCountRow row : dailyPageViewRows) {
            DailyAccumulator accumulator = dailyMap.get(row.getVisitDate());
            if (accumulator != null) {
                accumulator.pageViewCount = row.getPageViewCount();
            }
        }

        long totalVisitors = 0L;
        long totalPageViews = 0L;
        List<AccessManagerDailyRowResponse> dailyStats = new ArrayList<>();

        for (Map.Entry<LocalDate, DailyAccumulator> entry : dailyMap.entrySet()) {
            LocalDate date = entry.getKey();
            DailyAccumulator acc = entry.getValue();

            totalVisitors += acc.visitorCount;
            totalPageViews += acc.pageViewCount;

            dailyStats.add(new AccessManagerDailyRowResponse(
                    date.toString(),
                    acc.visitorCount,
                    acc.pageViewCount,
                    calculateAverage(acc.pageViewCount, acc.visitorCount)
            ));
        }

        List<AccessPageAggregateRow> topPageRows =
                sitePageViewRepository.findTopPages(
                        range.fromDate(),
                        range.toDate(),
                        PageRequest.of(0, 10)
                );

        List<AccessManagerTopPageResponse> topPages = topPageRows.stream()
                .map(row -> new AccessManagerTopPageResponse(
                        row.getUri(),
                        row.getPageViewCount(),
                        row.getVisitorCount()
                ))
                .toList();

        AccessManagerSummaryResponse summary = new AccessManagerSummaryResponse(
                totalVisitors,
                totalPageViews,
                calculateAverage(totalPageViews, totalVisitors),
                dailyStats.size()
        );

        return new AccessManagerSearchResponse(
                range.fromDate().toString(),
                range.toDate().toString(),
                summary,
                dailyStats,
                topPages
        );
    }

    @Override
    public AccessManagerDailyPageSearchResponse searchDailyPages(LocalDate date) {
        List<AccessPageAggregateRow> pageRows =
                sitePageViewRepository.findDailyPages(date, PageRequest.of(0, 100));

        List<AccessManagerTopPageResponse> pages = pageRows.stream()
                .map(row -> new AccessManagerTopPageResponse(
                        row.getUri(),
                        row.getPageViewCount(),
                        row.getVisitorCount()
                ))
                .toList();

        return new AccessManagerDailyPageSearchResponse(date.toString(), pages);
    }

    @Override
    public AccessManagerPageLogSearchResponse searchPageLogs(LocalDate fromDate, LocalDate toDate, String uri) {
        DateRange range = resolveRange(fromDate, toDate);

        String finalUri = normalizeUri(uri);

        List<AccessPageLogRow> logRows = sitePageViewRepository.findPageLogs(
                range.fromDate(),
                range.toDate(),
                finalUri,
                PageRequest.of(0, 200)
        );

        List<AccessManagerPageLogResponse> logs = logRows.stream()
                .map(row -> new AccessManagerPageLogResponse(
                        formatDateTime(row.getViewedAt()),
                        safeText(row.getReferer()),
                        safeText(row.getIpAddress()),
                        safeText(row.getUserAgent())
                ))
                .toList();

        return new AccessManagerPageLogSearchResponse(
                range.fromDate().toString(),
                range.toDate().toString(),
                finalUri,
                logs
        );
    }

    @Override
    public byte[] downloadExcel(LocalDate fromDate, LocalDate toDate) {
        DateRange range = resolveRange(fromDate, toDate);

        AccessManagerSearchResponse summaryResponse = search(range.fromDate(), range.toDate());

        List<AccessPageAggregateRow> allPages =
                sitePageViewRepository.findAllPages(range.fromDate(), range.toDate());

        List<AccessPageLogRow> allLogs =
                sitePageViewRepository.findPageLogsForExcel(range.fromDate(), range.toDate());

        SXSSFWorkbook workbook = new SXSSFWorkbook(200);
        workbook.setCompressTempFiles(true);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle bodyStyle = createBodyStyle(workbook, false);
            CellStyle bodyWrapStyle = createBodyStyle(workbook, true);

            writeDailySummarySheet(workbook, headerStyle, bodyStyle, summaryResponse);
            writePageStatsSheet(workbook, headerStyle, bodyStyle, bodyWrapStyle, allPages);
            writePageLogsSheet(workbook, headerStyle, bodyStyle, bodyWrapStyle, allLogs);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("엑셀 파일 생성 중 오류가 발생했습니다.", e);
        } finally {
            workbook.dispose();
            try {
                workbook.close();
            } catch (IOException ignored) {
            }
        }
    }

    private void writeDailySummarySheet(SXSSFWorkbook workbook,
                                        CellStyle headerStyle,
                                        CellStyle bodyStyle,
                                        AccessManagerSearchResponse response) {

        SXSSFSheet sheet = workbook.createSheet("일별통계");
        setColumnWidths(sheet, 0, 18, 18, 18, 18);

        int rowIdx = 0;

        rowIdx = writeKeyValueRow(sheet, rowIdx, "조회 시작일", response.getFromDate(), headerStyle, bodyStyle);
        rowIdx = writeKeyValueRow(sheet, rowIdx, "조회 종료일", response.getToDate(), headerStyle, bodyStyle);
        rowIdx = writeKeyValueRow(sheet, rowIdx, "총 접속자", String.valueOf(response.getSummary().getTotalVisitors()), headerStyle, bodyStyle);
        rowIdx = writeKeyValueRow(sheet, rowIdx, "총 페이지뷰", String.valueOf(response.getSummary().getTotalPageViews()), headerStyle, bodyStyle);
        rowIdx = writeKeyValueRow(sheet, rowIdx, "평균 PV/접속자", String.valueOf(response.getSummary().getAveragePageViewsPerVisitor()), headerStyle, bodyStyle);

        rowIdx++;
        Row headerRow = sheet.createRow(rowIdx++);
        writeCell(headerRow, 0, "날짜", headerStyle);
        writeCell(headerRow, 1, "접속자", headerStyle);
        writeCell(headerRow, 2, "페이지뷰", headerStyle);
        writeCell(headerRow, 3, "PV/접속자", headerStyle);

        for (AccessManagerDailyRowResponse row : response.getDailyStats()) {
            Row dataRow = sheet.createRow(rowIdx++);
            writeCell(dataRow, 0, row.getDate(), bodyStyle);
            writeCell(dataRow, 1, String.valueOf(row.getVisitorCount()), bodyStyle);
            writeCell(dataRow, 2, String.valueOf(row.getPageViewCount()), bodyStyle);
            writeCell(dataRow, 3, String.valueOf(row.getPageViewsPerVisitor()), bodyStyle);
        }

        sheet.createFreezePane(0, 6);
    }

    private void writePageStatsSheet(SXSSFWorkbook workbook,
                                     CellStyle headerStyle,
                                     CellStyle bodyStyle,
                                     CellStyle bodyWrapStyle,
                                     List<AccessPageAggregateRow> allPages) {

        SXSSFSheet sheet = workbook.createSheet("페이지통계");
        setColumnWidths(sheet, 0, 60, 18, 18);

        int rowIdx = 0;

        Row headerRow = sheet.createRow(rowIdx++);
        writeCell(headerRow, 0, "페이지 URI", headerStyle);
        writeCell(headerRow, 1, "페이지뷰", headerStyle);
        writeCell(headerRow, 2, "접속자수", headerStyle);

        for (AccessPageAggregateRow row : allPages) {
            Row dataRow = sheet.createRow(rowIdx++);
            writeCell(dataRow, 0, safeText(row.getUri()), bodyWrapStyle);
            writeCell(dataRow, 1, String.valueOf(row.getPageViewCount()), bodyStyle);
            writeCell(dataRow, 2, String.valueOf(row.getVisitorCount()), bodyStyle);
        }

        sheet.createFreezePane(0, 1);
    }

    private void writePageLogsSheet(SXSSFWorkbook workbook,
                                    CellStyle headerStyle,
                                    CellStyle bodyStyle,
                                    CellStyle bodyWrapStyle,
                                    List<AccessPageLogRow> allLogs) {

        SXSSFSheet sheet = workbook.createSheet("접속로그");
        setColumnWidths(sheet, 0, 22, 60, 42, 18, 70);

        int rowIdx = 0;

        Row headerRow = sheet.createRow(rowIdx++);
        writeCell(headerRow, 0, "접속시간", headerStyle);
        writeCell(headerRow, 1, "페이지 URI", headerStyle);
        writeCell(headerRow, 2, "Referrer", headerStyle);
        writeCell(headerRow, 3, "IP", headerStyle);
        writeCell(headerRow, 4, "User-Agent", headerStyle);

        for (AccessPageLogRow row : allLogs) {
            Row dataRow = sheet.createRow(rowIdx++);
            writeCell(dataRow, 0, formatDateTime(row.getViewedAt()), bodyStyle);
            writeCell(dataRow, 1, safeText(row.getUri()), bodyWrapStyle);
            writeCell(dataRow, 2, safeText(row.getReferer()), bodyWrapStyle);
            writeCell(dataRow, 3, safeText(row.getIpAddress()), bodyStyle);
            writeCell(dataRow, 4, safeText(row.getUserAgent()), bodyWrapStyle);
        }

        sheet.createFreezePane(0, 1);
    }

    private int writeKeyValueRow(SXSSFSheet sheet,
                                 int rowIdx,
                                 String key,
                                 String value,
                                 CellStyle headerStyle,
                                 CellStyle bodyStyle) {

        Row row = sheet.createRow(rowIdx);
        writeCell(row, 0, key, headerStyle);
        writeCell(row, 1, safeText(value), bodyStyle);
        return rowIdx + 1;
    }

    private void writeCell(Row row, int cellIndex, String value, CellStyle style) {
        Cell cell = row.createCell(cellIndex);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private void setColumnWidths(SXSSFSheet sheet, int startColumn, int... widths) {
        for (int i = 0; i < widths.length; i++) {
            sheet.setColumnWidth(startColumn + i, widths[i] * 256);
        }
    }

    private CellStyle createHeaderStyle(SXSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor((short) 22);
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor((short) 9);
        style.setFont(font);

        return style;
    }

    private CellStyle createBodyStyle(SXSSFWorkbook workbook, boolean wrapText) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(wrapText);
        return style;
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "-";
        }
        return DATE_TIME_FORMATTER.format(dateTime);
    }

    private String normalizeUri(String uri) {
        if (uri == null || uri.isBlank()) {
            throw new IllegalArgumentException("페이지 URI는 필수입니다.");
        }
        return uri.trim();
    }

    private String safeText(String value) {
        return (value == null || value.isBlank()) ? "-" : value;
    }

    private DateRange resolveRange(LocalDate fromDate, LocalDate toDate) {
        LocalDate today = LocalDate.now();

        LocalDate finalToDate = (toDate != null) ? toDate : today;
        LocalDate finalFromDate = (fromDate != null) ? fromDate : finalToDate.minusDays(6);

        if (finalFromDate.isAfter(finalToDate)) {
            throw new IllegalArgumentException("시작일은 종료일보다 클 수 없습니다.");
        }

        return new DateRange(finalFromDate, finalToDate);
    }

    private double calculateAverage(long pageViews, long visitors) {
        if (visitors <= 0L) {
            return 0.0d;
        }

        return BigDecimal.valueOf(pageViews)
                .divide(BigDecimal.valueOf(visitors), 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private record DateRange(LocalDate fromDate, LocalDate toDate) {
    }

    private static class DailyAccumulator {
        private long visitorCount;
        private long pageViewCount;
    }
}