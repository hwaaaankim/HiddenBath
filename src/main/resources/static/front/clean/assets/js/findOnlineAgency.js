/* =========================
   findOnlineAgency.js
   ========================= */

// ===== Utility =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const API_BASE = '/online-agency';
let currentPage = 0;

document.addEventListener('DOMContentLoaded', () => {
	bindFilters();
	loadList(0);
});

function bindFilters() {
	$('#btnSearch').addEventListener('click', () => loadList(0));
	$('#sizeSelect').addEventListener('change', () => loadList(0));
	$('#keywordInput').addEventListener('keydown', (e) => {
		if (e.key === 'Enter') loadList(0);
	});
}

async function loadList(page = 0) {
	const type = $('#typeSelect').value;
	const keyword = $('#keywordInput').value.trim();
	const size = parseInt($('#sizeSelect').value, 10) || 16;

	const params = new URLSearchParams({ type, keyword, page, size });
	try {
		const res = await fetch(`${API_BASE}?${params.toString()}`, { method: 'GET' });
		if (!res.ok) throw new Error('조회 실패');
		const data = await res.json();

		currentPage = data.page ?? 0;
		renderCards(data.content || []);
		renderPagination(data.page ?? 0, data.totalPages ?? 1);
	} catch (err) {
		console.error(err);
		renderCards([]);
		// 데이터 오류/없음이어도 항상 표시: << < 1 > >>
		renderPagination(0, 1);
	}
}

function renderCards(items) {
	const wrap = $('#cardList');
	wrap.innerHTML = '';

	if (!items.length) {
		wrap.innerHTML = `<div class="col-12 text-center text-muted py-4">조회 결과가 없습니다.</div>`;
		return;
	}

	items.forEach(item => {
		const col = document.createElement('div');
		col.className = 'col-lg-3 col-md-6 col-sm-12 col-xs-12 mb-3 d-flex';

		const homepageBtn = item.homepageUrl
			? `<a class="button alt agency-button onlineAgency-find-homebtn"
             target="_blank" rel="noopener"
             href="${escapeUrl(item.homepageUrl)}">
           <i class="fas fa-external-link-alt" aria-hidden="true"></i>
           홈페이지 방문하기
         </a>`
			: '';

		col.innerHTML = `
      <div class="onlineAgency-find-card w-100">
        <div class="onlineAgency-find-card-body">
          ${item.logoImageRoad ? `
            <div class="onlineAgency-find-logo">
              <img src="${escapeHtml(item.logoImageRoad)}" alt="logo">
            </div>` : ''}

          <div class="onlineAgency-find-row">
            <div class="onlineAgency-find-label">대리점명</div>
            <div class="onlineAgency-find-value">${escapeHtml(item.name || '-')}</div>
          </div>

          <div class="onlineAgency-find-row">
            <div class="onlineAgency-find-label">연락처</div>
            <div class="onlineAgency-find-value">${escapeHtml(item.contact || '-')}</div>
          </div>

          <div class="onlineAgency-find-row">
            <div class="onlineAgency-find-label">팩스</div>
            <div class="onlineAgency-find-value">${escapeHtml(item.fax || '-')}</div>
          </div>

          ${homepageBtn}
        </div>
      </div>
    `;
		wrap.appendChild(col);
	});
}

/**
 * 페이지네이션 렌더 (사용자 제공 디자인 **그대로**)
 * - 마크업: <nav class="pagination"><ul class="pagination justify-content-center" id="pagination">...</ul></nav>
 * - 비활성: li.page-item.disabled + a.page-link.current
 * - 데이터 없어도 항상 « < 1 > » 표시 (숫자는 최소 1만)
 */
function renderPagination(page, totalPages) {
	const ul = $('#pagination');
	ul.innerHTML = '';

	const tp = (typeof totalPages === 'number' && totalPages > 0) ? totalPages : 1;
	const cur = Math.min(Math.max(0, page || 0), tp - 1);

	const add = (label, targetPage, disabled, current) => {
		const li = document.createElement('li');
		li.className = `page-item${disabled ? ' disabled' : ''}`;

		const a = document.createElement('a');
		a.className = `page-link${current ? ' current' : ''}`;
		a.textContent = label;
		a.href = 'javascript:void(0);';

		if (!disabled && !current && typeof targetPage === 'number') {
			a.addEventListener('click', () => loadList(targetPage));
		}

		if (disabled) {
			a.setAttribute('tabindex', '-1');
			a.setAttribute('aria-disabled', 'true');
		}

		li.appendChild(a);
		ul.appendChild(li);
	};

	const isFirst = (cur === 0);
	const isLast = (cur >= tp - 1);

	// << (첫페이지)
	add('<<', 0, isFirst, isFirst);
	// < (이전)
	add('<', Math.max(0, cur - 1), isFirst, isFirst);

	// 숫자들 (tp==1이면 1만 표시)
	for (let i = 0; i < tp; i++) {
		add(String(i + 1), i, i === cur, i === cur);
	}

	// > (다음)
	add('>', Math.min(tp - 1, cur + 1), isLast, isLast);
	// >> (끝)
	add('>>', tp - 1, isLast, isLast);
}

/* ===== Escape Utils ===== */
function escapeHtml(s) {
	if (s == null) return '';
	return s.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
function escapeUrl(u) {
	const trimmed = String(u || '').trim();
	if (/^javascript:/i.test(trimmed)) return '#';
	return trimmed;
}
