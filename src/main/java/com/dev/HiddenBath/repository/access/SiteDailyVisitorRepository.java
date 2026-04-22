package com.dev.HiddenBath.repository.access;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dev.HiddenBath.dto.access.AccessDailyVisitorCountRow;
import com.dev.HiddenBath.model.access.SiteDailyVisitor;

public interface SiteDailyVisitorRepository extends JpaRepository<SiteDailyVisitor, Long> {

    boolean existsByVisitDateAndVisitorId(LocalDate visitDate, String visitorId);

    @Query("""
        select new com.dev.HiddenBath.dto.access.AccessDailyVisitorCountRow(
            sd.visitDate,
            count(sd.id)
        )
        from SiteDailyVisitor sd
        where sd.visitDate between :fromDate and :toDate
        group by sd.visitDate
        order by sd.visitDate asc
    """)
    List<AccessDailyVisitorCountRow> findDailyVisitorCounts(LocalDate fromDate, LocalDate toDate);
}