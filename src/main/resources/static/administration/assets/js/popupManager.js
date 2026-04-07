// ===== 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ========== 생성 폼: 미리보기/제거 ========== */
(function initCreatePreview() {
	const file = $('#create-image');
	const wrap = $('#create-preview-wrap');
	const img = $('#create-preview');
	const removeBtn = $('#create-remove-image');

	file.addEventListener('change', () => {
		const f = file.files?.[0];
		if (!f) { wrap.style.display = 'none'; img.src = ''; return; }
		const reader = new FileReader();
		reader.onload = () => {
			img.src = reader.result;
			wrap.style.display = 'block';
		};
		reader.readAsDataURL(f);
	});

	removeBtn.addEventListener('click', () => {
		file.value = '';
		img.src = '';
		wrap.style.display = 'none';
	});
})();

/* ========== 등록 버튼 ========== */
$('#create-submit').addEventListener('click', async () => {
	const image = $('#create-image').files?.[0];
	const startDate = $('#create-startDate').value;
	const endDate = $('#create-endDate').value;

	if (!image) return alert('이미지를 선택해 주세요.');
	if (!startDate || !endDate) return alert('시작일/종료일을 입력해 주세요.');

	const fd = new FormData();
	fd.append('image', image);
	fd.append('startDate', startDate);
	fd.append('endDate', endDate);

	try {
		const res = await fetch('/admin/api/popups', { method: 'POST', body: fd });
		if (!res.ok) throw new Error('등록 실패');
		await res.json();
		alert('등록되었습니다.');
		// 폼 초기화
		$('#create-image').value = '';
		$('#create-preview').src = '';
		$('#create-preview-wrap').style.display = 'none';
		$('#create-startDate').value = '';
		$('#create-endDate').value = '';
		await loadList();
	} catch (e) {
		console.error(e);
		alert('등록 중 오류가 발생했습니다.');
	}
});

/* ========== 목록 로드 & 렌더링 ========== */
async function loadList() {
	const listWrap = $('#popup-card-list');
	listWrap.innerHTML = `<div class="text-center py-5 text-muted">로딩중...</div>`;

	try {
		const res = await fetch('/admin/api/popups');
		const list = await res.json();

		if (!Array.isArray(list) || list.length === 0) {
			listWrap.innerHTML = `<div class="text-center py-5 text-muted">등록된 팝업이 없습니다.</div>`;
			return;
		}

		listWrap.innerHTML = '';
		list.forEach(item => listWrap.appendChild(renderCard(item)));
	} catch (e) {
		console.error(e);
		listWrap.innerHTML = `<div class="text-center py-5 text-danger">목록을 불러오지 못했습니다.</div>`;
	}
}

function renderCard(item) {
	const col = document.createElement('div');
	col.className = 'col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6';

	const card = document.createElement('div');
	card.className = 'card h-100';

	const body = document.createElement('div');
	body.className = 'card-body d-flex flex-column';

	// 이미지
	const imgWrap = document.createElement('div');
	imgWrap.className = 'mb-3 position-relative';

	const img = document.createElement('img');
	img.src = item.imageUrl;
	img.alt = 'popup';
	img.className = 'img-fluid rounded border w-100';
	imgWrap.appendChild(img);

	// 이미지 교체 input + 미리보기
	const file = document.createElement('input');
	file.type = 'file';
	file.accept = 'image/*';
	file.className = 'form-control mt-2';
	file.addEventListener('change', () => {
		const f = file.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => img.src = reader.result;
		reader.readAsDataURL(f);
		enableSave();
	});

	// 날짜
	const start = document.createElement('input');
	start.type = 'date';
	start.className = 'form-control mt-2';
	start.value = item.startDate;

	const end = document.createElement('input');
	end.type = 'date';
	end.className = 'form-control mt-2';
	end.value = item.endDate;

	start.addEventListener('change', enableSave);
	end.addEventListener('change', enableSave);

	// 버튼 영역
	const btnRow = document.createElement('div');
	btnRow.className = 'd-flex gap-2 mt-3 mt-auto';

	const btnSave = document.createElement('button');
	btnSave.className = 'btn btn-success flex-grow-1';
	btnSave.textContent = '수정';
	btnSave.disabled = true;

	const btnDelete = document.createElement('button');
	btnDelete.className = 'btn btn-outline-danger';
	btnDelete.textContent = '삭제';

	btnRow.appendChild(btnSave);
	btnRow.appendChild(btnDelete);

	body.appendChild(imgWrap);
	body.appendChild(file);
	body.appendChild(start);
	body.appendChild(end);
	body.appendChild(btnRow);
	card.appendChild(body);
	col.appendChild(card);

	function enableSave() { btnSave.disabled = false; }

	btnSave.addEventListener('click', async () => {
		const fd = new FormData();
		if (file.files?.[0]) fd.append('image', file.files[0]);
		fd.append('startDate', start.value);
		fd.append('endDate', end.value);

		try {
			const res = await fetch(`/admin/api/popups/${item.id}`, { method: 'PUT', body: fd });
			if (!res.ok) throw new Error('수정 실패');
			await res.json();
			alert('수정되었습니다.');
			btnSave.disabled = true;
			await loadList();
		} catch (e) {
			console.error(e);
			alert('수정 중 오류가 발생했습니다.');
		}
	});

	btnDelete.addEventListener('click', async () => {
		if (!confirm('정말 삭제하시겠습니까?')) return;
		try {
			const res = await fetch(`/admin/api/popups/${item.id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('삭제 실패');
			alert('삭제되었습니다.');
			await loadList();
		} catch (e) {
			console.error(e);
			alert('삭제 중 오류가 발생했습니다.');
		}
	});

	return col;
}

document.addEventListener('DOMContentLoaded', loadList);
