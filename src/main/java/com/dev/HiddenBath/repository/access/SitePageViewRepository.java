package com.dev.HiddenBath.repository.access;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dev.HiddenBath.dto.access.AccessDailyPageViewCountRow;
import com.dev.HiddenBath.dto.access.AccessPageAggregateRow;
import com.dev.HiddenBath.dto.access.AccessPageLogRow;
import com.dev.HiddenBath.model.access.SitePageView;

public interface SitePageViewRepository extends JpaRepository<SitePageView, Long> {

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessDailyPageViewCountRow(
            sp.visitDate,
            count(sp.id)
        )
        from SitePageView sp
        where sp.visitDate between :fromDate and :toDate
        group by sp.visitDate
        order by sp.visitDate asc
    """)
    List<AccessDailyPageViewCountRow> findDailyPageViewCounts(LocalDate fromDate, LocalDate toDate);

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessPageAggregateRow(
            sp.uri,
            count(sp.id),
            count(distinct sp.visitorId)
        )
        from SitePageView sp
        where sp.visitDate between :fromDate and :toDate
        group by sp.uri
        order by count(sp.id) desc, sp.uri asc
    """)
    List<AccessPageAggregateRow> findTopPages(LocalDate fromDate, LocalDate toDate, Pageable pageable);

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessPageAggregateRow(
            sp.uri,
            count(sp.id),
            count(distinct sp.visitorId)
        )
        from SitePageView sp
        where sp.visitDate = :date
        group by sp.uri
        order by count(sp.id) desc, sp.uri asc
    """)
    List<AccessPageAggregateRow> findDailyPages(LocalDate date, Pageable pageable);

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessPageAggregateRow(
            sp.uri,
            count(sp.id),
            count(distinct sp.visitorId)
        )
        from SitePageView sp
        where sp.visitDate between :fromDate and :toDate
        group by sp.uri
        order by count(sp.id) desc, sp.uri asc
    """)
    List<AccessPageAggregateRow> findAllPages(LocalDate fromDate, LocalDate toDate);

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessPageLogRow(
            sp.viewedAt,
            sp.uri,
            sp.referer,
            sp.ipAddress,
            sp.userAgent
        )
        from SitePageView sp
        where sp.visitDate between :fromDate and :toDate
          and sp.uri = :uri
        order by sp.viewedAt desc
    """)
    List<AccessPageLogRow> findPageLogs(LocalDate fromDate, LocalDate toDate, String uri, Pageable pageable);

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessPageLogRow(
            sp.viewedAt,
            sp.uri,
            sp.referer,
            sp.ipAddress,
            sp.userAgent
        )
        from SitePageView sp
        where sp.visitDate between :fromDate and :toDate
        order by sp.viewedAt desc
    """)
    List<AccessPageLogRow> findPageLogsForExcel(LocalDate fromDate, LocalDate toDate);
}