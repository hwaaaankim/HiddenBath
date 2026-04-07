// ===== 공통 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function renderPreview(file, box) {
	const img = box.querySelector('img');
	const clearBtn = box.querySelector('.cm-preview-clear');
	if (!file) {
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

function attachClearHandler(input, box, submitBtn) {
	const clearBtn = box.querySelector('.cm-preview-clear');
	if (!clearBtn) return;
	clearBtn.addEventListener('click', () => {
		input.value = '';
		renderPreview(null, box);
		if (submitBtn) {
			if (input.dataset.scope === 'insert') {
				const other = input.id === 'cm-insert-thumb' ? $('#cm-insert-origin') : $('#cm-insert-thumb');
				if (!other.files?.length) submitBtn.disabled = true;
			} else {
				const wrap = input.closest('.cm-update-form');
				const t = wrap.querySelector('.cm-thumb-input');
				const o = wrap.querySelector('.cm-origin-input');
				if (!t.value && !o.value) submitBtn.disabled = true;
			}
		}
	});
}

function openModal(src) {
	const modalImg = $('#cm-modal-img');
	modalImg.src = src;
	const modalEl = $('#cmImageModal');
	const bsModal = new bootstrap.Modal(modalEl);
	bsModal.show();
}

// ===== 업로드 폼 =====
(function initInsertForm() {
	const thumbInput = $('#cm-insert-thumb');
	const originInput = $('#cm-insert-origin');
	const thumbBox = $('#cm-insert-thumb-preview');
	const originBox = $('#cm-insert-origin-preview');
	const uploadBtn = $('#cm-insert-btn');

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

// ===== 카드 폼 =====
(function initCardForms() {
	// 확대(+)
	$$('.cm-enlarge-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			const src = btn.getAttribute('data-fullsrc');
			if (src) openModal(src);
		});
	});

	// 수정
	$$('.cm-update-form').forEach(form => {
		const id = form.querySelector('.cm-thumb-input')?.getAttribute('data-id');
		const thumbInput = form.querySelector('.cm-thumb-input');
		const originInput = form.querySelector('.cm-origin-input');
		const updateBtn = form.querySelector(`#cm-update-btn-${id}`);
		const thumbBox = form.querySelector(`#cm-thumb-preview-${id}`);
		const originBox = form.querySelector(`#cm-origin-preview-${id}`);

		if (!thumbInput || !originInput || !updateBtn) return;

		const onChange = (input, box) => {
			const f = input.files?.[0];
			renderPreview(f, box);
			attachClearHandler(input, box, updateBtn);
			updateBtn.disabled = !(thumbInput.files?.length || originInput.files?.length);
		};

		thumbInput.addEventListener('change', () => onChange(thumbInput, thumbBox));
		originInput.addEventListener('change', () => onChange(originInput, originBox));
	});
})();

// ===== 삭제 =====
(function initDeleteButtons() {
	$$('.cm-delete-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const id = btn.getAttribute('data-id');
			if (!id) return;
			if (!confirm('정말 삭제하시겠습니까? (원본/썸네일 파일 및 DB 레코드가 모두 삭제됩니다)')) {
				return;
			}
			const form = btn.closest('.cm-delete-form');
			if (form) {
				form.removeAttribute('onsubmit'); // form 중첩 방지용 기본 차단 해제
				form.submit();
			}
		});
	});
})();
