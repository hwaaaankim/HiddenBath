(function () {
    'use strict';

    const numberFormatter = new Intl.NumberFormat('ko-KR');

    const searchForm = document.getElementById('access-manager-search-form');
    const fromDateInput = document.getElementById('access-manager-from-date');
    const toDateInput = document.getElementById('access-manager-to-date');
    const searchBtn = document.getElementById('access-manager-search-btn');
    const resetBtn = document.getElementById('access-manager-reset-btn');
    const excelBtn = document.getElementById('access-manager-excel-btn');

    const totalVisitorsEl = document.getElementById('access-manager-total-visitors');
    const totalPageViewsEl = document.getElementById('access-manager-total-pageviews');
    const avgPageViewsEl = document.getElementById('access-manager-avg-pageviews');
    const periodDaysEl = document.getElementById('access-manager-period-days');

    const dailyChartEl = document.getElementById('access-manager-daily-chart');
    const topPagesEl = document.getElementById('access-manager-top-pages');
    const dailyTableBodyEl = document.getElementById('access-manager-daily-table-body');

    const dailyModalElement = document.getElementById('access-manager-daily-modal');
    const dailyModalTitleEl = document.getElementById('access-manager-daily-modal-title');
    const dailyModalBodyEl = document.getElementById('access-manager-daily-modal-body');

    const pageLogModalElement = document.getElementById('access-manager-page-log-modal');
    const pageLogModalTitleEl = document.getElementById('access-manager-page-log-modal-title');
    const pageLogModalBodyEl = document.getElementById('access-manager-page-log-modal-body');

    const dailyModal = (window.bootstrap && dailyModalElement)
        ? new bootstrap.Modal(dailyModalElement)
        : null;

    const pageLogModal = (window.bootstrap && pageLogModalElement)
        ? new bootstrap.Modal(pageLogModalElement)
        : null;

    document.addEventListener('DOMContentLoaded', function () {
        bindEvents();
        loadStats();
    });

    function bindEvents() {
        if (searchForm) {
            searchForm.addEventListener('submit', function (event) {
                event.preventDefault();

                const range = getValidatedRange();
                if (!range) {
                    return;
                }

                loadStats();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                const today = new Date();
                const from = new Date();
                from.setDate(today.getDate() - 6);

                fromDateInput.value = formatDateForInput(from);
                toDateInput.value = formatDateForInput(today);

                loadStats();
            });
        }

        if (excelBtn) {
            excelBtn.addEventListener('click', function () {
                const range = getValidatedRange();
                if (!range) {
                    return;
                }

                const url = `/admin/api/site/access/excel?fromDate=${encodeURIComponent(range.fromDate)}&toDate=${encodeURIComponent(range.toDate)}`;
                window.location.href = url;
            });
        }

        if (dailyTableBodyEl) {
            dailyTableBodyEl.addEventListener('click', function (event) {
                const detailButton = event.target.closest('.access-manager-detail-btn');
                if (!detailButton) {
                    return;
                }

                const date = detailButton.getAttribute('data-date');
                if (!date) {
                    return;
                }

                loadDailyPages(date);
            });
        }

        if (topPagesEl) {
            topPagesEl.addEventListener('click', function (event) {
                const uriButton = event.target.closest('.access-manager-page-uri-btn');
                if (!uriButton) {
                    return;
                }

                const uri = uriButton.getAttribute('data-uri');
                const fromDate = uriButton.getAttribute('data-from-date');
                const toDate = uriButton.getAttribute('data-to-date');

                if (!uri || !fromDate || !toDate) {
                    return;
                }

                loadPageLogs(uri, fromDate, toDate, false);
            });
        }

        if (dailyModalBodyEl) {
            dailyModalBodyEl.addEventListener('click', function (event) {
                const uriButton = event.target.closest('.access-manager-page-uri-btn');
                if (!uriButton) {
                    return;
                }

                const uri = uriButton.getAttribute('data-uri');
                const fromDate = uriButton.getAttribute('data-from-date');
                const toDate = uriButton.getAttribute('data-to-date');

                if (!uri || !fromDate || !toDate) {
                    return;
                }

                loadPageLogs(uri, fromDate, toDate, true);
            });
        }
    }

    async function loadStats() {
        setSearchLoading(true);
        renderLoadingState();

        try {
            const range = getValidatedRange();
            if (!range) {
                setSearchLoading(false);
                return;
            }

            const response = await fetch(`/admin/api/site/access/stats?fromDate=${encodeURIComponent(range.fromDate)}&toDate=${encodeURIComponent(range.toDate)}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('통계 데이터를 불러오지 못했습니다.');
            }

            const data = await response.json();

            renderSummary(data.summary);
            renderDailyChart(data.dailyStats || []);
            renderTopPages(data.topPages || [], data.fromDate, data.toDate);
            renderDailyTable(data.dailyStats || []);
        } catch (error) {
            console.error(error);
            renderErrorState('통계 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setSearchLoading(false);
        }
    }

    async function loadDailyPages(date) {
        dailyModalTitleEl.textContent = `${date} 페이지 상세`;
        dailyModalBodyEl.innerHTML = `
            <tr>
                <td colspan="3">
                    <div class="access-manager-loading-wrap">
                        <div class="access-manager-loading-spinner"></div>
                        <span>상세 데이터를 불러오는 중입니다.</span>
                    </div>
                </td>
            </tr>
        `;

        if (dailyModal) {
            dailyModal.show();
        }

        try {
            const response = await fetch(`/admin/api/site/access/daily-pages?date=${encodeURIComponent(date)}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('일별 상세 데이터를 불러오지 못했습니다.');
            }

            const data = await response.json();
            renderDailyPagesModal(data.pages || [], date);
        } catch (error) {
            console.error(error);
            dailyModalBodyEl.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center access-manager-empty-cell">상세 데이터를 불러오는 중 오류가 발생했습니다.</td>
                </tr>
            `;
        }
    }

    async function loadPageLogs(uri, fromDate, toDate, fromDailyModal) {
        pageLogModalTitleEl.textContent = `${uri} 접속 로그`;
        pageLogModalBodyEl.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="access-manager-loading-wrap">
                        <div class="access-manager-loading-spinner"></div>
                        <span>접속 로그를 불러오는 중입니다.</span>
                    </div>
                </td>
            </tr>
        `;

        if (fromDailyModal && dailyModal) {
            dailyModal.hide();
        }

        if (pageLogModal) {
            pageLogModal.show();
        }

        try {
            const response = await fetch(
                `/admin/api/site/access/page-logs?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}&uri=${encodeURIComponent(uri)}`,
                {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('페이지 로그를 불러오지 못했습니다.');
            }

            const data = await response.json();
            renderPageLogsModal(data.logs || []);
        } catch (error) {
            console.error(error);
            pageLogModalBodyEl.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center access-manager-empty-cell">페이지 로그를 불러오는 중 오류가 발생했습니다.</td>
                </tr>
            `;
        }
    }

    function renderSummary(summary) {
        if (!summary) {
            animateValue(totalVisitorsEl, 0, 0, false);
            animateValue(totalPageViewsEl, 0, 0, false);
            animateDecimalValue(avgPageViewsEl, 0, 0);
            animateValue(periodDaysEl, 0, 0, false);
            return;
        }

        animateValue(totalVisitorsEl, 0, summary.totalVisitors || 0, false);
        animateValue(totalPageViewsEl, 0, summary.totalPageViews || 0, false);
        animateDecimalValue(avgPageViewsEl, 0, summary.averagePageViewsPerVisitor || 0);
        animateValue(periodDaysEl, 0, summary.periodDays || 0, false);
    }

    function renderDailyChart(dailyStats) {
        if (!dailyStats.length) {
            dailyChartEl.innerHTML = `<div class="access-manager-empty">선택한 기간의 일별 데이터가 없습니다.</div>`;
            return;
        }

        const maxValue = Math.max(
            ...dailyStats.map(item => Math.max(item.visitorCount || 0, item.pageViewCount || 0)),
            1
        );

        let html = '';

        dailyStats.forEach((item, index) => {
            const visitorWidth = Math.max(4, Math.round(((item.visitorCount || 0) / maxValue) * 100));
            const pageViewWidth = Math.max(4, Math.round(((item.pageViewCount || 0) / maxValue) * 100));

            html += `
                <div class="access-manager-daily-chart-row" style="animation-delay:${index * 0.04}s">
                    <div class="access-manager-daily-chart-head">
                        <div class="access-manager-daily-chart-date">${escapeHtml(item.date)}</div>
                        <div class="access-manager-daily-chart-meta">
                            <span>접속자 ${formatNumber(item.visitorCount)}</span>
                            <span>페이지뷰 ${formatNumber(item.pageViewCount)}</span>
                            <span>PV/접속자 ${formatDecimal(item.pageViewsPerVisitor)}</span>
                        </div>
                    </div>
                    <div class="access-manager-daily-chart-bar-group">
                        <div class="access-manager-daily-chart-bar-line">
                            <div class="access-manager-daily-chart-bar-label">접속자</div>
                            <div class="access-manager-daily-chart-bar-track">
                                <div class="access-manager-daily-chart-bar-fill access-manager-visitors-bar"
                                     style="width:${visitorWidth}%"></div>
                            </div>
                            <div class="access-manager-daily-chart-bar-value">${formatNumber(item.visitorCount)}</div>
                        </div>
                        <div class="access-manager-daily-chart-bar-line">
                            <div class="access-manager-daily-chart-bar-label">페이지뷰</div>
                            <div class="access-manager-daily-chart-bar-track">
                                <div class="access-manager-daily-chart-bar-fill access-manager-pageviews-bar"
                                     style="width:${pageViewWidth}%"></div>
                            </div>
                            <div class="access-manager-daily-chart-bar-value">${formatNumber(item.pageViewCount)}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        dailyChartEl.innerHTML = html;
    }

    function renderTopPages(topPages, fromDate, toDate) {
        if (!topPages.length) {
            topPagesEl.innerHTML = `<div class="access-manager-empty">선택한 기간의 페이지 데이터가 없습니다.</div>`;
            return;
        }

        let html = '';

        topPages.forEach((item, index) => {
            html += `
                <div class="access-manager-top-page-item" style="animation-delay:${index * 0.04}s">
                    <div class="access-manager-top-page-left">
                        <div class="access-manager-top-page-uri-wrap">
                            <button type="button"
                                    class="access-manager-page-uri-btn"
                                    data-uri="${escapeHtml(item.uri || '-')}"
                                    data-from-date="${escapeHtml(fromDate)}"
                                    data-to-date="${escapeHtml(toDate)}">
                                ${escapeHtml(item.uri || '-')}
                            </button>
                        </div>
                        <div class="access-manager-top-page-sub">
                            <span>페이지뷰 ${formatNumber(item.pageViewCount)}</span>
                            <span>접속자 ${formatNumber(item.visitorCount)}</span>
                        </div>
                    </div>
                    <div class="access-manager-top-page-right">${formatNumber(item.pageViewCount)} PV</div>
                </div>
            `;
        });

        topPagesEl.innerHTML = html;
    }

    function renderDailyTable(dailyStats) {
        if (!dailyStats.length) {
            dailyTableBodyEl.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center access-manager-empty-cell">선택한 기간의 일별 데이터가 없습니다.</td>
                </tr>
            `;
            return;
        }

        let html = '';

        dailyStats.forEach((item) => {
            html += `
                <tr>
                    <td class="text-center">${escapeHtml(item.date)}</td>
                    <td class="text-center">${formatNumber(item.visitorCount)}</td>
                    <td class="text-center">${formatNumber(item.pageViewCount)}</td>
                    <td class="text-center">${formatDecimal(item.pageViewsPerVisitor)}</td>
                    <td class="text-center">
                        <button type="button"
                                class="btn btn-soft-primary access-manager-detail-btn"
                                data-date="${escapeHtml(item.date)}">
                            상세보기
                        </button>
                    </td>
                </tr>
            `;
        });

        dailyTableBodyEl.innerHTML = html;
    }

    function renderDailyPagesModal(pages, date) {
        if (!pages.length) {
            dailyModalBodyEl.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center access-manager-empty-cell">선택한 날짜의 페이지 데이터가 없습니다.</td>
                </tr>
            `;
            return;
        }

        let html = '';

        pages.forEach((item) => {
            html += `
                <tr>
                    <td>
                        <button type="button"
                                class="access-manager-page-uri-btn"
                                data-uri="${escapeHtml(item.uri || '-')}"
                                data-from-date="${escapeHtml(date)}"
                                data-to-date="${escapeHtml(date)}">
                            ${escapeHtml(item.uri || '-')}
                        </button>
                    </td>
                    <td class="text-center">${formatNumber(item.pageViewCount)}</td>
                    <td class="text-center">${formatNumber(item.visitorCount)}</td>
                </tr>
            `;
        });

        dailyModalBodyEl.innerHTML = html;
    }

    function renderPageLogsModal(logs) {
        if (!logs.length) {
            pageLogModalBodyEl.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center access-manager-empty-cell">선택한 조건의 접속 로그가 없습니다.</td>
                </tr>
            `;
            return;
        }

        let html = '';

        logs.forEach((item) => {
            html += `
                <tr>
                    <td class="text-center">${escapeHtml(item.viewedAt || '-')}</td>
                    <td class="access-manager-log-referrer">${escapeHtml(item.referer || '-')}</td>
                    <td class="text-center">${escapeHtml(item.ipAddress || '-')}</td>
                    <td class="access-manager-log-user-agent" title="${escapeHtml(item.userAgent || '-')}">${escapeHtml(shortenText(item.userAgent || '-', 90))}</td>
                </tr>
            `;
        });

        pageLogModalBodyEl.innerHTML = html;
    }

    function renderLoadingState() {
        dailyChartEl.innerHTML = `
            <div class="access-manager-loading-wrap">
                <div class="access-manager-loading-spinner"></div>
                <span>일별 통계를 불러오는 중입니다.</span>
            </div>
        `;

        topPagesEl.innerHTML = `
            <div class="access-manager-loading-wrap">
                <div class="access-manager-loading-spinner"></div>
                <span>페이지 통계를 불러오는 중입니다.</span>
            </div>
        `;

        dailyTableBodyEl.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="access-manager-loading-wrap">
                        <div class="access-manager-loading-spinner"></div>
                        <span>일별 목록을 불러오는 중입니다.</span>
                    </div>
                </td>
            </tr>
        `;
    }

    function renderErrorState(message) {
        dailyChartEl.innerHTML = `<div class="access-manager-empty">${escapeHtml(message)}</div>`;
        topPagesEl.innerHTML = `<div class="access-manager-empty">${escapeHtml(message)}</div>`;
        dailyTableBodyEl.innerHTML = `
            <tr>
                <td colspan="5" class="text-center access-manager-empty-cell">${escapeHtml(message)}</td>
            </tr>
        `;
    }

    function setSearchLoading(loading) {
        if (searchBtn) {
            searchBtn.disabled = loading;
            const textEl = searchBtn.querySelector('.access-manager-btn-text');
            if (textEl) {
                textEl.textContent = loading ? '검색중...' : '검색';
            }
        }

        if (excelBtn) {
            excelBtn.disabled = loading;
        }
    }

    function getValidatedRange() {
        const fromDate = fromDateInput.value;
        const toDate = toDateInput.value;

        if (!fromDate || !toDate) {
            alert('시작일과 종료일을 모두 선택해주세요.');
            return null;
        }

        if (fromDate > toDate) {
            alert('시작일은 종료일보다 클 수 없습니다.');
            return null;
        }

        return { fromDate, toDate };
    }

    function animateValue(element, start, end, isDecimal) {
        if (!element) {
            return;
        }

        const duration = 550;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = start + ((end - start) * progress);

            if (isDecimal) {
                element.textContent = formatDecimal(current);
            } else {
                element.textContent = formatNumber(Math.round(current));
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = isDecimal ? formatDecimal(end) : formatNumber(end);
            }
        }

        requestAnimationFrame(update);
    }

    function animateDecimalValue(element, start, end) {
        animateValue(element, start, end, true);
    }

    function formatNumber(value) {
        return numberFormatter.format(Number(value || 0));
    }

    function formatDecimal(value) {
        return Number(value || 0).toFixed(2);
    }

    function shortenText(text, maxLength) {
        if (!text || text.length <= maxLength) {
            return text || '-';
        }
        return text.substring(0, maxLength) + '...';
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }
})();