// ===== 공통 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/**
 * 파일을 읽어 미리보기 박스에 반영
 * @param {File} file 
 * @param {HTMLElement} box - .gm-preview-box
 */
function renderPreview(file, box) {
	const img = box.querySelector('img');
	const clearBtn = box.querySelector('.gm-preview-clear');
	if (!file) {
		// 초기화
		img.style.display = 'none';
		img.removeAttribute('src');
		if (clearBtn) clearBtn.style.display = 'none';
		const hint = box.querySelector('span.text-muted');
		if (hint) hint.style.display = 'inline';
		return;
	}
	const reader = new FileReader();
	reader.onload = (e) => {
		img.src = e.target.result;
		img.style.display = 'block';
		if (clearBtn) clearBtn.style.display = 'inline-block';
		const hint = box.querySelector('span.text-muted');
		if (hint) hint.style.display = 'none';
	};
	reader.readAsDataURL(file);
}

/**
 * 미리보기 박스 초기화 핸들러
 * @param {HTMLInputElement} input 
 * @param {HTMLElement} box 
 * @param {HTMLButtonElement} submitBtn  (옵션)
 */
function attachClearHandler(input, box, submitBtn) {
	const clearBtn = box.querySelector('.gm-preview-clear');
	if (!clearBtn) return;
	clearBtn.addEventListener('click', () => {
		input.value = '';
		renderPreview(null, box);
		if (submitBtn) {
			// 업로드 폼: 두 입력 모두 비었으면 비활성화
			if (input.dataset.scope === 'insert') {
				const other = input.id === 'gm-insert-thumb' ? $('#gm-insert-origin') : $('#gm-insert-thumb');
				if (!other.files?.length) submitBtn.disabled = true;
			} else {
				// 카드 폼: 두 입력 모두 비었으면 비활성화
				const wrap = input.closest('.gm-update-form');
				const t = wrap.querySelector('.gm-thumb-input');
				const o = wrap.querySelector('.gm-origin-input');
				if (!t.value && !o.value) submitBtn.disabled = true;
			}
		}
	});
}

/**
 * 확대 모달 열기
 * @param {string} src 
 */
function openModal(src) {
	const modalImg = $('#gm-modal-img');
	modalImg.src = src;
	const modalEl = $('#gmImageModal');
	const bsModal = new bootstrap.Modal(modalEl);
	bsModal.show();
}
(function initDeleteButtons() {
	$$('.gm-delete-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const id = btn.getAttribute('data-id');
			if (!id) return;
			if (!confirm('정말 삭제하시겠습니까? (원본/썸네일 파일 및 DB 레코드가 모두 삭제됩니다)')) {
				return;
			}
			// 삭제 폼 제출 (서버에서 alert + redirect 스크립트 반환)
			const form = btn.closest('.gm-delete-form');
			if (form) {
				form.removeAttribute('onsubmit'); // onsubmit 막힘 제거
				form.submit();
			}
		});
	});
})();
// ===== 업로드 폼 처리 =====
(function initInsertForm() {
	const thumbInput = $('#gm-insert-thumb');
	const originInput = $('#gm-insert-origin');
	const thumbBox = $('#gm-insert-thumb-preview');
	const originBox = $('#gm-insert-origin-preview');
	const uploadBtn = $('#gm-insert-btn');

	if (!thumbInput || !originInput) return;

	thumbInput.dataset.scope = 'insert';
	originInput.dataset.scope = 'insert';

	thumbInput.addEventListener('change', () => {
		const f = thumbInput.files?.[0];
		renderPreview(f, thumbBox);
		attachClearHandler(thumbInput, thumbBox, uploadBtn);
		uploadBtn.disabled = !(thumbInput.files?.length || originInput.files?.length);
	});

	originInput.addEventListener('change', () => {
		const f = originInput.files?.[0];
		renderPreview(f, originBox);
		attachClearHandler(originInput, originBox, uploadBtn);
		uploadBtn.disabled = !(thumbInput.files?.length || originInput.files?.length);
	});
})();

// ===== 카드(리스트) 폼 처리 =====
(function initCardForms() {
	// 확대 버튼(+)
	$$('.gm-enlarge-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			const src = btn.getAttribute('data-fullsrc');
			if (src) openModal(src);
		});
	});

	// 각 카드의 파일 인풋 & 미리보기
	$$('.gm-update-form').forEach(form => {
		const id = form.querySelector('.gm-thumb-input')?.getAttribute('data-id');
		const thumbInput = form.querySelector('.gm-thumb-input');
		const originInput = form.querySelector('.gm-origin-input');
		const updateBtn = form.querySelector(`#gm-update-btn-${id}`);
		const thumbBox = form.querySelector(`#gm-thumb-preview-${id}`);
		const originBox = form.querySelector(`#gm-origin-preview-${id}`);

		if (!thumbInput || !originInput || !updateBtn) return;

		const onChange = (input, box) => {
			const f = input.files?.[0];
			renderPreview(f, box);
			attachClearHandler(input, box, updateBtn);
			// 둘 중 하나라도 선택되면 활성화
			updateBtn.disabled = !(thumbInput.files?.length || originInput.files?.length);
		};

		thumbInput.addEventListener('change', () => onChange(thumbInput, thumbBox));
		originInput.addEventListener('change', () => onChange(originInput, originBox));
	});
})();
