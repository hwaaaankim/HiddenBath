// ===== 공통 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const API_BASE = '/admin/online-agency';
let currentPage = 0;

document.addEventListener('DOMContentLoaded', () => {
	initCreateForm();
	bindSearchControls();
	loadList(0);
});

/* ================= 등록 폼 ================= */
function initCreateForm() {
	const input = $('#create-logo');
	const previewImg = $('#create-logo-preview');
	const emptySpan = $('#create-logo-empty');

	input.addEventListener('change', () => {
		if (input.files && input.files[0]) {
			const url = URL.createObjectURL(input.files[0]);
			previewImg.src = url;
			previewImg.style.display = 'block';
			emptySpan.style.display = 'none';
		} else {
			clearCreateLogoPreview();
		}
	});

	$('#create-logo-clear').addEventListener('click', () => {
		input.value = '';
		clearCreateLogoPreview();
	});

	$('#btnCreate').addEventListener('click', async () => {
		const name = $('#create-name').value.trim();
		const contact = $('#create-contact').value.trim();
		const fax = $('#create-fax').value.trim();
		const homepage = $('#create-homepage').value.trim();

		if (!name) {
			alert('대리점명을 입력해 주세요.');
			$('#create-name').focus();
			return;
		}

		const fd = new FormData();
		fd.append('name', name);
		if (contact) fd.append('contact', contact);
		if (fax) fd.append('fax', fax);
		if (homepage) fd.append('homepageUrl', homepage);
		if (input.files && input.files[0]) {
			fd.append('logo', input.files[0]);
		}

		try {
			const res = await fetch(API_BASE, {
				method: 'POST',
				body: fd
			});
			if (!res.ok) throw new Error('등록 실패');
			// 성공 후 초기화 및 목록 새로고침
			$('#agencyCreateForm').reset();
			clearCreateLogoPreview();
			loadList(0);
		} catch (e) {
			console.error(e);
			alert('등록 중 오류가 발생했습니다.');
		}
	});

	function clearCreateLogoPreview() {
		previewImg.src = '';
		previewImg.style.display = 'none';
		emptySpan.style.display = 'inline';
	}
}

/* ================= 검색/페이지 ================= */
function bindSearchControls() {
	$('#btnSearch').addEventListener('click', () => loadList(0));
	$('#sizeSelect').addEventListener('change', () => loadList(0));
}

async function loadList(page = 0) {
	const type = $('#typeSelect').value;
	const keyword = $('#keywordInput').value.trim();
	const size = parseInt($('#sizeSelect').value, 10) || 16;

	const params = new URLSearchParams({
		type, keyword, page, size
	});

	try {
		const res = await fetch(`${API_BASE}?${params.toString()}`, { method: 'GET' });
		if (!res.ok) throw new Error('조회 실패');
		const data = await res.json();
		currentPage = data.page;
		renderCardList(data.content || []);
		renderPagination(data.page, data.totalPages);
	} catch (e) {
		console.error(e);
		alert('목록 조회 중 오류가 발생했습니다.');
	}
}

/* ================= 카드 렌더링 ================= */
function renderCardList(items) {
	const wrap = $('#cardList');
	wrap.innerHTML = '';

	if (!items.length) {
		wrap.innerHTML = `<div class="col-12 text-center text-muted py-4">조회 결과가 없습니다.</div>`;
		return;
	}

	items.forEach(item => {
		const col = document.createElement('div');
		col.className = 'col-12 col-md-6 col-lg-3';

		// 카드 DOM
		col.innerHTML = `
            <div class="card h-100" data-id="${item.id}">
                <div class="card-body d-flex flex-column">
                    <div class="mb-2 text-center">
                        <div class="border d-inline-flex align-items-center justify-content-center"
                             style="width:120px;height:40px;overflow:hidden;position:relative;">
                            ${item.logoImageRoad ? `<img src="${item.logoImageRoad}" alt="logo" style="max-width:120px;max-height:40px;">`
				: `<span class="text-muted" style="font-size:12px;">미리보기(120×40)</span>`}
                        </div>
                    </div>

                    <div class="mb-2">
                        <label class="form-label mb-1">대리점명</label>
                        <input type="text" class="form-control agency-name" maxlength="100" value="${escapeHtml(item.name || '')}">
                    </div>

                    <div class="mb-2">
                        <label class="form-label mb-1">연락처</label>
                        <input type="text" class="form-control agency-contact" value="${escapeHtml(item.contact || '')}">
                    </div>

                    <div class="mb-2">
                        <label class="form-label mb-1">팩스번호</label>
                        <input type="text" class="form-control agency-fax" value="${escapeHtml(item.fax || '')}">
                    </div>

                    <div class="mb-2">
                        <label class="form-label mb-1">홈페이지주소</label>
                        <input type="text" class="form-control agency-homepage" value="${escapeHtml(item.homepageUrl || '')}">
                    </div>

                    <div class="mb-2">
                        <label class="form-label mb-1">로고 이미지 (변경 시 선택)</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="file" class="form-control agency-logo-input" accept="image/*">
                            <button type="button" class="btn btn-outline-secondary btn-logo-clear">X</button>
                        </div>
                        <div class="mt-2">
                            <div class="border d-inline-flex align-items-center justify-content-center logo-preview-box"
                                 style="width:120px;height:40px;overflow:hidden;position:relative;">
                                ${item.logoImageRoad ? `<img class="logo-preview" src="${item.logoImageRoad}" style="max-width:120px;max-height:40px;">`
				: `<span class="logo-preview-empty text-muted" style="font-size:12px;">미리보기(120×40)</span>`}
                            </div>
                        </div>
                        <input type="hidden" class="remove-logo-flag" value="false">
                    </div>

                    <div class="mt-auto d-flex gap-2">
                        <button class="btn btn-danger flex-fill btn-delete">삭제</button>
                        <button class="btn btn-secondary flex-fill btn-update" disabled>수정</button>
                    </div>
                </div>
            </div>
        `;
		wrap.appendChild(col);
	});

	// 바인딩(위임)
	bindCardEvents();
}

/* ================= 카드 이벤트 바인딩 ================= */
function bindCardEvents() {
	$$('#cardList .card').forEach(card => {
		const id = card.getAttribute('data-id');
		const btnUpdate = card.querySelector('.btn-update');

		// ✅ 입력 도중 즉시 활성화를 위해 'input' 이벤트 사용 (텍스트 인풋)
		card.querySelectorAll('input[type="text"]').forEach(inp => {
			inp.addEventListener('input', () => {
				btnUpdate.disabled = false;
			});
		});

		// 파일은 선택 시에만 변화가 발생하므로 'change' 유지
		const fileInput = card.querySelector('.agency-logo-input');
		const previewBox = card.querySelector('.logo-preview-box');
		const removeFlag = card.querySelector('.remove-logo-flag');

		fileInput.addEventListener('change', () => {
			if (fileInput.files && fileInput.files[0]) {
				const url = URL.createObjectURL(fileInput.files[0]);
				previewBox.innerHTML = `<img class="logo-preview" src="${url}" style="max-width:120px;max-height:40px;">`;
				removeFlag.value = 'false'; // 새 파일 선택 시 제거 플래그 해제
				btnUpdate.disabled = false; // 파일 선택 즉시 활성화
			}
		});

		// X 버튼(프리뷰/등록 해제) → removeLogo = true
		const btnClear = card.querySelector('.btn-logo-clear');
		btnClear.addEventListener('click', () => {
			fileInput.value = '';
			previewBox.innerHTML = `<span class="logo-preview-empty text-muted" style="font-size:12px;">미리보기(120×40)</span>`;
			removeFlag.value = 'true';
			btnUpdate.disabled = false; // 즉시 활성화
		});

		// 삭제
		const btnDelete = card.querySelector('.btn-delete');
		btnDelete.addEventListener('click', async () => {
			if (!confirm('삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
			try {
				const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
				if (!res.ok) throw new Error('삭제 실패');
				loadList(currentPage); // 현재 페이지 갱신
			} catch (e) {
				console.error(e);
				alert('삭제 중 오류가 발생했습니다.');
			}
		});

		// 수정
		btnUpdate.addEventListener('click', async () => {
			const name = card.querySelector('.agency-name').value.trim();
			const contact = card.querySelector('.agency-contact').value.trim();
			const fax = card.querySelector('.agency-fax').value.trim();
			const homepage = card.querySelector('.agency-homepage').value.trim();
			const file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
			const removeLogo = (card.querySelector('.remove-logo-flag').value === 'true');

			if (!name) {
				alert('대리점명을 입력해 주세요.');
				card.querySelector('.agency-name').focus();
				return;
			}

			const fd = new FormData();
			fd.append('name', name);
			fd.append('contact', contact);
			fd.append('fax', fax);
			fd.append('homepageUrl', homepage);
			fd.append('removeLogo', String(removeLogo));
			if (file) fd.append('logo', file);

			try {
				const res = await fetch(`${API_BASE}/${id}`, {
					method: 'PUT',
					body: fd
				});
				if (!res.ok) throw new Error('수정 실패');
				// 성공 후 목록 재조회(현재 페이지 유지)
				loadList(currentPage);
			} catch (e) {
				console.error(e);
				alert('수정 중 오류가 발생했습니다.');
			}
		});
	});
}

/* ================= 페이지네이션 ================= */
function renderPagination(page, totalPages) {
	const ul = $('#pagination');
	ul.innerHTML = '';
	if (!totalPages || totalPages <= 1) return;

	const createItem = (label, p, disabled = false, active = false) => {
		const li = document.createElement('li');
		li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
		const a = document.createElement('a');
		a.className = 'page-link';
		a.href = 'javascript:void(0);';
		a.textContent = label;
		if (!disabled && !active) {
			a.addEventListener('click', () => loadList(p));
		}
		li.appendChild(a);
		return li;
	};

	// Prev
	ul.appendChild(createItem('«', Math.max(0, page - 1), page === 0, false));

	// 숫자 나열 (필요 시 범위 제한 적용 가능)
	for (let i = 0; i < totalPages; i++) {
		ul.appendChild(createItem(String(i + 1), i, false, i === page));
	}

	// Next
	ul.appendChild(createItem('»', Math.min(totalPages - 1, page + 1), page >= totalPages - 1, false));
}

/* ================= 기타 ================= */
function escapeHtml(s) {
	if (s == null) return '';
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt/')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
