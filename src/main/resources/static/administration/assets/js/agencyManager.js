// ===== 공통 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

let state = {
	page: 0,
	size: 10,
	type: 'name',
	keyword: ''
};

/** Kakao SDK 동적 로드 (HTTPS 고정 + autoload=false + 중복/경합 방지 + 실패시 false 반환) */
function loadKakaoSdk() {
	return new Promise((resolve) => {
		if (window.kakao?.maps?.services) return resolve(true);
		if (!window.KAKAO_JS_KEY || window.KAKAO_JS_KEY.length < 10) {
			console.warn('Kakao JS KEY 미설정');
			return resolve(false);
		}
		const exist = document.getElementById('kakao-sdk');
		if (exist) {
			const init = () => {
				if (window.kakao?.maps?.load) {
					window.kakao.maps.load(() => resolve(!!window.kakao?.maps?.services));
				} else {
					resolve(!!window.kakao?.maps?.services);
				}
			};
			init();
			exist.addEventListener('load', init, { once: true });
			exist.addEventListener('error', (e) => {
				console.error('Kakao SDK 기존 스크립트 오류:', e);
				resolve(false);
			}, { once: true });
			return;
		}
		const script = document.createElement('script');
		script.id = 'kakao-sdk';
		script.async = true;
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(window.KAKAO_JS_KEY)}&libraries=services&autoload=false`;
		script.onload = () => {
			try {
				if (!window.kakao?.maps?.load) {
					console.error('kakao.maps.load 없음 → 키 유형/도메인/사용설정 확인 필요');
					return resolve(false);
				}
				window.kakao.maps.load(() => {
					resolve(!!window.kakao?.maps?.services);
				});
			} catch (err) {
				console.error('Kakao SDK onload 처리 오류:', err);
				resolve(false);
			}
		};
		script.onerror = (e) => {
			console.error('Kakao SDK 네트워크/권한 오류:', e);
			resolve(false);
		};
		document.head.appendChild(script);
	});
}

async function fetchList() {
	const params = new URLSearchParams({
		type: state.type,
		keyword: state.keyword || '',
		page: String(state.page),
		size: String(state.size)
	});
	const resp = await fetch(`/admin/api/agencies?${params.toString()}`);
	if (!resp.ok) {
		const msg = await resp.text().catch(() => '');
		alert('목록 조회 실패: ' + msg);
		return;
	}
	const page = await resp.json();
	renderList(page);
	renderPagination(page);
}

function renderList(page) {
	const wrap = $('#cardList');
	wrap.innerHTML = '';
	if (!page || !page.content || page.content.length === 0) {
		wrap.innerHTML = `<div class="col-12 text-center text-muted py-4">데이터가 없습니다.</div>`;
		return;
	}
	page.content.forEach(item => {
		wrap.insertAdjacentHTML('beforeend', cardTemplate(item));
	});
	bindCardEvents();
}

/** 카드 템플릿
 * - col: lg-3(한 줄 4개), md-4, sm-6
 * - .card-body 를 d-flex flex-column 로 구성해 버튼을 하단 정렬
 * - 로고 이미지 높이 60px 고정
 * - '수정 저장' 초기 disabled, 변경 발생 시 활성화
 */
function cardTemplate(a) {
	const imgSrc = a.logoImageRoad || '/assets/images/placeholder-image.png';
	const safe = (v) => escapeHtml(v || '');
	const addrSummary = buildAddressSummary(a);
	const latTxt = (a.latitude ?? '') === '' ? '—' : a.latitude;
	const lngTxt = (a.longitude ?? '') === '' ? '—' : a.longitude;

	return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <!-- 상단 아이콘 -->
          <div class="text-center mb-3">
            <img src="${imgSrc}" alt="icon"
                 class="border rounded d-block mx-auto"
                 style="height:60px; width:auto; object-fit:contain;">
            <input type="file" class="form-control form-control-sm mt-2 agency-icon-input" data-id="${a.id}" accept="image/*">
          </div>

          <div class="row g-2 flex-grow-1">
            <div class="col-6">
              <label class="form-label">대리점명</label>
              <input type="text" class="form-control dirty-watch" value="${safe(a.name)}" data-field="name" data-id="${a.id}">
            </div>
            <div class="col-6">
              <label class="form-label">담당직원</label>
              <input type="text" class="form-control dirty-watch" value="${safe(a.staffName)}" data-field="staffName" data-id="${a.id}">
            </div>

            <div class="col-6">
              <label class="form-label">대표번호</label>
              <input type="text" class="form-control dirty-watch" value="${safe(a.tel)}" data-field="tel" data-id="${a.id}">
            </div>
            <div class="col-6">
              <label class="form-label">핸드폰번호</label>
              <input type="text" class="form-control dirty-watch" value="${safe(a.mobile)}" data-field="mobile" data-id="${a.id}">
            </div>

            <!-- ★ 추가: 팩스번호 -->
            <div class="col-6">
              <label class="form-label">팩스번호</label>
              <input type="text" class="form-control dirty-watch" value="${safe(a.fax)}" data-field="fax" data-id="${a.id}">
            </div>
            <div class="col-6">
              <label class="form-label">카카오톡 링크</label>
              <input type="text" class="form-control dirty-watch" value="${safe(a.kakaoTalkLink)}" data-field="kakaoTalkLink" data-id="${a.id}">
            </div>

            <div class="col-12">
              <button type="button" class="btn btn-outline-secondary btn-sm btn-postcode" data-id="${a.id}">주소검색</button>
              <div class="mt-2">
                <p class="small text-muted mb-1 agency-addr-summary" data-id="${a.id}">${addrSummary || '—'}</p>
                <p class="small text-muted mb-0 agency-latlng" data-id="${a.id}">
                  위도: <span data-role="lat">${latTxt}</span>, 경도: <span data-role="lng">${lngTxt}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="mt-2">
            <div class="row g-2 w-100">
              <div class="col-6 d-grid">
                <button type="button" class="btn btn-primary btn-save w-100" data-id="${a.id}" disabled>수정 저장</button>
              </div>
              <div class="col-6 d-grid">
                <button type="button" class="btn btn-danger btn-delete w-100" data-id="${a.id}">삭제</button>
              </div>
            </div>
          </div>

          <!-- 숨김 데이터 -->
          <input type="hidden" data-field="postcode" data-id="${a.id}" value="${safe(a.postcode)}">
          <input type="hidden" data-field="roadAddress" data-id="${a.id}" value="${safe(a.roadAddress)}">
          <input type="hidden" data-field="jibunAddress" data-id="${a.id}" value="${safe(a.jibunAddress)}">
          <input type="hidden" data-field="addressDetail" data-id="${a.id}" value="${safe(a.addressDetail)}">
          <input type="hidden" data-field="sido" data-id="${a.id}" value="${safe(a.sido)}">
          <input type="hidden" data-field="sigungu" data-id="${a.id}" value="${safe(a.sigungu)}">
          <input type="hidden" data-field="bname" data-id="${a.id}" value="${safe(a.bname)}">
          <input type="hidden" data-field="latitude" data-id="${a.id}" value="${a.latitude ?? ''}">
          <input type="hidden" data-field="longitude" data-id="${a.id}" value="${a.longitude ?? ''}">
        </div>
      </div>
    </div>
  `;
}


function buildAddressSummary(a) {
	const segs = [];
	if (a.postcode) segs.push(`(${a.postcode})`);
	if (a.roadAddress) segs.push(a.roadAddress);
	if (a.addressDetail) segs.push(a.addressDetail);
	const line1 = segs.join(' ');
	const line2 = [a.sido, a.sigungu, a.bname].filter(Boolean).join(' ');
	const jibun = a.jibunAddress ? `지번: ${a.jibunAddress}` : '';
	return [line1, line2, jibun].filter(Boolean).join('<br>');
}

function escapeHtml(s) {
	return (s ?? '').toString()
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function renderPagination(page) {
	const ul = $('#pagination');
	ul.innerHTML = '';
	if (!page || page.totalPages <= 1) return;

	function pageItem(label, targetPage, disabled, active) {
		return `
      <li class="page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${disabled ? '' : targetPage}">${label}</a>
      </li>
    `;
	}
	ul.insertAdjacentHTML('beforeend', pageItem('First', 0, page.first, false));
	ul.insertAdjacentHTML('beforeend', pageItem('Previous', page.number - 1, !page.hasPrevious, false));

	const start = Math.max(0, page.number - 2);
	const end = Math.min(page.totalPages - 1, page.number + 2);
	for (let i = start; i <= end; i++) {
		ul.insertAdjacentHTML('beforeend', pageItem(String(i + 1), i, false, i === page.number));
	}
	ul.insertAdjacentHTML('beforeend', pageItem('Next', page.number + 1, !page.hasNext, false));
	ul.insertAdjacentHTML('beforeend', pageItem('Last', page.totalPages - 1, page.last, false));

	ul.querySelectorAll('a.page-link').forEach(a => {
		a.addEventListener('click', e => {
			e.preventDefault();
			const p = a.getAttribute('data-page');
			if (p === null || p === '') return;
			state.page = Number(p);
			fetchList();
		});
	});
}

function bindSearchBar() {
	$('#btnSearch').addEventListener('click', () => {
		state.page = 0;
		state.size = Number($('#sizeSelect').value);
		state.type = $('#typeSelect').value;
		state.keyword = $('#keywordInput').value.trim();
		fetchList();
	});
	$('#sizeSelect').value = String(state.size);
	$('#typeSelect').value = state.type;
}

/** 카드 내 변경 감지 → 저장 버튼 활성화 */
function markDirty(card) {
	if (!card) return;
	card.dataset.dirty = '1';
	const saveBtn = card.querySelector('.btn-save');
	if (saveBtn) saveBtn.disabled = false;
}

function bindCardEvents() {
	// 아이콘 미리보기 + 변경 감지
	$$('.agency-icon-input').forEach(input => {
		input.addEventListener('change', (e) => {
			const card = e.target.closest('.card-body');
			const img = card.querySelector('img');
			const f = e.target.files && e.target.files[0];
			if (f) {
				const reader = new FileReader();
				reader.onload = ev => { img.src = ev.target.result; };
				reader.readAsDataURL(f);
				markDirty(card);
			}
		});
	});

	// 텍스트 입력 변경 감지 (name, staffName, tel, mobile, kakaoTalkLink)
	$$('.dirty-watch').forEach(inp => {
		inp.addEventListener('input', (e) => {
			markDirty(e.target.closest('.card-body'));
		});
	});

	// 주소검색 (다음 우편번호)
	$$('.btn-postcode').forEach(btn => {
		btn.addEventListener('click', async () => {
			if (!window.daum?.postcode) {
				console.warn('Daum Postcode script not ready');
			}
			new daum.Postcode({
				oncomplete: async function(data) {
					const card = btn.closest('.card-body');
					const id = btn.getAttribute('data-id');

					// 선택 결과 정리
					const postcode = data.zonecode || '';
					const roadAddress = data.roadAddress || '';
					const jibunAddress = data.jibunAddress || '';
					const sido = data.sido || '';
					const sigungu = data.sigungu || '';
					const bname = data.bname || '';

					// 상세주소는 기존 값 유지(숨김 인풋)
					const dInput = card.querySelector(`input[data-field="addressDetail"][data-id="${id}"]`);
					const addressDetail = dInput?.value?.trim() ?? '';

					// 숨김 인풋에 반영
					setHiddenField(card, id, 'postcode', postcode);
					setHiddenField(card, id, 'roadAddress', roadAddress);
					setHiddenField(card, id, 'jibunAddress', jibunAddress);
					setHiddenField(card, id, 'sido', sido);
					setHiddenField(card, id, 'sigungu', sigungu);
					setHiddenField(card, id, 'bname', bname);

					// 주소 요약 UI 갱신
					const summaryHtml = buildAddressSummary({
						postcode, roadAddress, jibunAddress, addressDetail, sido, sigungu, bname
					});
					const p = card.querySelector(`.agency-addr-summary[data-id="${id}"]`);
					if (p) p.innerHTML = summaryHtml || '—';

					// 주소 변경 시 위/경도 자동 계산
					const ok = await loadKakaoSdk();
					if (ok && roadAddress) {
						const geocoder = new kakao.maps.services.Geocoder();
						geocoder.addressSearch(roadAddress, function(result, status) {
							if (status === kakao.maps.services.Status.OK && result && result[0]) {
								const lat = result[0].y;
								const lng = result[0].x;
								setHiddenField(card, id, 'latitude', lat);
								setHiddenField(card, id, 'longitude', lng);

								// 화면 표시 업데이트
								const latlng = card.querySelector(`.agency-latlng[data-id="${id}"]`);
								if (latlng) {
									latlng.querySelector('[data-role="lat"]').textContent = lat;
									latlng.querySelector('[data-role="lng"]').textContent = lng;
								}
								alert('주소와 좌표가 갱신되었습니다.');
							} else {
								alert('주소는 갱신되었으나 지오코딩에 실패했습니다.');
							}
							// 어쨌든 변경 발생 → 저장 가능
							markDirty(card);
						});
					} else {
						alert('주소가 갱신되었습니다.');
						markDirty(card);
					}
				}
			}).open();
		});
	});

	// 저장
	// 저장
	$$('.btn-save').forEach(btn => {
		btn.addEventListener('click', async () => {
			const id = btn.getAttribute('data-id');
			const card = btn.closest('.card-body');
			const toVal = (f) => card.querySelector(`input[data-field="${f}"][data-id="${id}"]`)?.value?.trim() ?? '';

			const formObj = {
				name: toVal('name'),
				staffName: toVal('staffName'),
				tel: toVal('tel'),
				mobile: toVal('mobile'),
				fax: toVal('fax'),                       // ★ 추가
				kakaoTalkLink: toVal('kakaoTalkLink'),

				// 주소(숨김)
				postcode: toVal('postcode'),
				roadAddress: toVal('roadAddress'),
				jibunAddress: toVal('jibunAddress'),
				addressDetail: toVal('addressDetail'),
				sido: toVal('sido'),
				sigungu: toVal('sigungu'),
				bname: toVal('bname')
			};

			const lat = toVal('latitude');
			const lng = toVal('longitude');
			if (lat) formObj.latitude = Number(lat);
			if (lng) formObj.longitude = Number(lng);

			const fd = new FormData();
			fd.append('form', new Blob([JSON.stringify(formObj)], { type: 'application/json' }));

			const iconInput = card.querySelector('.agency-icon-input');
			if (iconInput?.files?.[0]) {
				fd.append('icon', iconInput.files[0]);
			}

			const resp = await fetch(`/admin/api/agencies/${id}`, {
				method: 'PUT',
				body: fd
			});
			if (!resp.ok) {
				const msg = await resp.text().catch(() => '');
				alert('수정 실패: ' + msg);
				return;
			}
			alert('수정되었습니다.');
			btn.disabled = true;
			card.dataset.dirty = '0';
			fetchList();
		});
	});


	// 삭제
	$$('.btn-delete').forEach(btn => {
		btn.addEventListener('click', async () => {
			const id = btn.getAttribute('data-id');
			if (!confirm('삭제하시겠습니까?')) return;
			const resp = await fetch(`/admin/api/agencies/${id}`, { method: 'DELETE' });
			if (!resp.ok) {
				const msg = await resp.text().catch(() => '');
				alert('삭제 실패: ' + msg);
				return;
			}
			alert('삭제되었습니다.');
			fetchList();
		});
	});
}

// 숨김 필드 유틸
function setHiddenField(card, id, field, value) {
	const el = card.querySelector(`input[data-field="${field}"][data-id="${id}"]`);
	if (el) el.value = value ?? '';
}
function getHiddenField(card, id, field) {
	return card.querySelector(`input[data-field="${field}"][data-id="${id}"]`)?.value?.trim() ?? '';
}

/* ===== 초기화 ===== */
document.addEventListener('DOMContentLoaded', () => {
	window.KAKAO_JS_KEY = window.KAKAO_JS_KEY || (typeof KAKAO_JS_KEY !== 'undefined' ? KAKAO_JS_KEY : '');
	bindSearchBar();
	fetchList();
});
