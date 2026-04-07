// ===== 공통 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

async function checkGeoPermissionAndGuide() {
	if (!('permissions' in navigator) || !navigator.permissions?.query) return;

	try {
		const status = await navigator.permissions.query({ name: 'geolocation' });
		// 상태: 'granted' | 'prompt' | 'denied'
		if (status.state === 'denied') {
			$('#geo-permission-banner')?.classList.remove('d-none');
			// 필요 시 '근처 대리점' 버튼 비활성화
			$('#nearbyBtn')?.setAttribute('disabled', 'disabled');
		}
		status.onchange = () => {
			// 사용자가 브라우저 설정에서 권한 바꾸면 여기로 감지 가능
			if (status.state !== 'denied') {
				$('#geo-permission-banner')?.classList.add('d-none');
				$('#nearbyBtn')?.removeAttribute('disabled');
			}
		};
	} catch { }
}

// 도움말/재시도 바인딩
$('#geo-help')?.addEventListener('click', () => {
	alert('브라우저 주소창의 사이트 정보(자물쇠) > 사이트 설정 > 위치 권한을 허용으로 변경하세요.');
});
$('#geo-retry')?.addEventListener('click', async () => {
	const pos = await getUserLocation();
	if (pos) {
		state.userPos = pos;
		state.page = 0;
		await loadAgencies();
		$('#geo-permission-banner')?.classList.add('d-none');
		$('#nearbyBtn')?.removeAttribute('disabled');
	} else {
		alert('여전히 위치 권한을 얻지 못했습니다. 브라우저 권한 설정을 확인해 주세요.');
	}
});

const state = {
	page: 0,
	size: 12,
	provinceId: '',
	provinceName: '',
	cityId: '',
	cityName: '',
	districtId: '',
	districtName: '',
	keyword: '',          // (옵션) 텍스트 검색을 쓸 경우
	userPos: null,        // {lat,lng}
	kakaoReady: false
};

// === 주소 포맷: (roadAddress || jibunAddress) + [공백 + addressDetail] + [ | postcode]
function formatFullAddress(a) {
	const road = (a.roadAddress ?? '').trim();
	const jibun = (a.jibunAddress ?? '').trim();
	const base = road || jibun;                 // 하나만 사용
	const detail = (a.addressDetail ?? '').trim();
	const postcode = (a.postcode ?? '').trim();

	let text = base || '-';
	if (detail) text += ' ' + detail;          // 상세주소는 공백으로 연결
	if (postcode) text += ' | ' + postcode;    // 우편번호는 " | "로 구분
	return text;
}

// Haversine 거리(km)
function distanceKm(lat1, lon1, lat2, lon2) {
	if ([lat1, lon1, lat2, lon2].some(v => v === null || v === undefined)) return null;
	const R = 6371;
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round((R * c) * 10) / 10;
}

// Kakao SDK 동적로드
async function loadKakaoSdk() {
	return new Promise((resolve) => {
		if (window.kakao?.maps?.services) return resolve(true);
		const key = window.__KAKAO_JS_KEY__;
		if (!key || key.length < 10) {
			console.warn('[KAKAO] JS KEY empty/short');
			return resolve(false);
		}
		const exist = document.getElementById('kakao-sdk');
		const finalize = () => {
			try {
				if (window.kakao?.maps?.services) return resolve(true);
				if (window.kakao?.maps?.load) {
					window.kakao.maps.load(() => resolve(!!window.kakao?.maps?.services));
				} else {
					resolve(false);
				}
			} catch (e) {
				console.error('[KAKAO] finalize error', e);
				resolve(false);
			}
		};
		if (exist) return finalize();
		const s = document.createElement('script');
		s.id = 'kakao-sdk';
		s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&libraries=services&autoload=false`;
		s.async = true;
		s.onload = finalize;
		s.onerror = () => { console.error('[KAKAO] script load error'); resolve(false); };
		document.head.appendChild(s);
	});
}

// 위치 획득
function getUserLocation() {
	if (!navigator.geolocation) return Promise.resolve(null);
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition(
			pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
			_ => resolve(null),
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
		);
	});
}

// ===== 최근 본 대리점 =====
const RECENT_KEY = 'recentAgencies';
function getRecent() {
	try {
		return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
	} catch { return []; }
}
function setRecent(list) {
	localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

function pushRecent(agency) {
	const list = getRecent().filter(a => a.id !== agency.id);
	list.unshift({
		id: agency.id,
		name: agency.name,
		roadAddress: agency.roadAddress || '',
		addressDetail: agency.addressDetail || '',
		postcode: agency.postcode || '',
		tel: agency.tel || '',
		fax: agency.fax || '',                 // ★ 팩스 저장
		latitude: agency.latitude ?? null,
		longitude: agency.longitude ?? null
	});
	setRecent(list.slice(0, 6));
}

function renderRecent() {
	const row = $('#recent-agencies-row');
	if (!row) return;
	const list = getRecent();

	row.innerHTML = list.map(a => {
		let distText = '– km';
		if (state.userPos && a.latitude != null && a.longitude != null) {
			const d = distanceKm(state.userPos.lat, state.userPos.lng, a.latitude, a.longitude);
			if (d != null) distText = `${d}km`;
		}
		const addrLine1 = a.roadAddress ?? '-';
		const addrLine2 = [a.addressDetail, a.postcode].filter(Boolean).join(' | ');
		const faxLine = a.fax ? `
			<div class="shipping-totals shipping">
			  <h2>FAX</h2>
			  <div class="subtotal-price"><span>${a.fax}</span></div>
			</div>` : '';

		return `
      <div class="col-xl-4 col-lg-5 col-md-12 col-12">
        <div class="checkout-review-order">
          <div class="checkout-review-order-table">
            <div class="review-order-title">
              ${a.name}
              <span class="distance-text">${distText}</span>
            </div>
            <div class="shipping-totals shipping">
              <h2>ADDRESS</h2>
              <div class="subtotal-price">
                <span>${addrLine1}</span><br>
                <span>${addrLine2 || '-'}</span>
              </div>
            </div>
            <div class="shipping-totals shipping">
              <h2>TEL</h2>
              <div class="subtotal-price"><span>${a.tel || '-'}</span></div>
            </div>
            ${faxLine}
          </div>
          <div class="checkout-payment">
            <div class="form-row place-order">
              <div class="agency-btn-wrap">
                <button type="button" class="button alt agency-button" data-agency-id="${a.id}">
                  <i class="fas fa-info-circle"></i> 상세보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
	}).join('');

	$$('#recent-agencies-row .agency-button').forEach(btn => {
		btn.addEventListener('click', () =>
			openAgencyModal(parseInt(btn.dataset.agencyId, 10)));
	});
}

// ===== API 래퍼 =====
async function fetchJSON(url) {
	const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
	if (!res.ok) throw new Error('API error');
	return await res.json();
}

async function loadAgencies() {
	const q = new URLSearchParams();
	q.set('page', state.page);
	q.set('size', state.size);

	// ✅ 이름 대신 ID 사용
	if (state.provinceId) q.set('provinceId', state.provinceId);
	if (state.cityId) q.set('cityId', state.cityId);
	if (state.districtId) q.set('districtId', state.districtId);

	// (옵션) 텍스트 검색
	if (state.keyword?.trim()) q.set('keyword', state.keyword.trim());

	// 사용자 좌표(가까운 순 정렬용)
	if (state.userPos) {
		q.set('lat', state.userPos.lat);
		q.set('lng', state.userPos.lng);
	}

	const data = await fetchJSON(`/api/agencies?${q.toString()}`);
	renderList(data);
	renderPagination(data);
}

function renderList(pageData) {
	const row = $('#agency-list-row');
	row.innerHTML = pageData.content.map(a => {
		const distText = (a.distanceKm != null) ? `${a.distanceKm}km` : '– km';
		const addrLine1 = a.roadAddress ?? '-';
		const addrLine2 = [a.addressDetail, a.postcode].filter(Boolean).join(' | ');
		const faxLine = a.fax ? `
			<div class="shipping-totals shipping">
			  <h2>FAX</h2>
			  <div class="subtotal-price"><span>${a.fax}</span></div>
			</div>` : '';

		return `
      <div class="col-xl-4 col-lg-5 col-md-12 col-12">
        <div class="checkout-review-order">
          <div class="checkout-review-order-table agency-card" data-agency-id="${a.id}">
            <div class="review-order-title">
              ${a.name}
              <span class="distance-text" data-distance-for="${a.id}">${distText}</span>
            </div>
            <div class="shipping-totals shipping">
              <h2>ADDRESS</h2>
              <div class="subtotal-price">
                <span>${addrLine1}</span><br>
                <span>${addrLine2 || '-'}</span>
              </div>
            </div>
            <div class="shipping-totals shipping">
              <h2>TEL</h2>
              <div class="subtotal-price"><span>${a.tel || '-'}</span></div>
            </div>
            ${faxLine}
          </div>
          <div class="checkout-payment">
            <div class="form-row place-order">
              <div class="agency-btn-wrap">
                <button type="button" class="button alt agency-button" data-agency-id="${a.id}">
                  <i class="fas fa-info-circle"></i> 상세보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
	}).join('');

	// 카드/버튼 클릭 → 모달
	$$('#agency-list-row .agency-card, #agency-list-row .agency-button').forEach(el => {
		el.addEventListener('click', () => {
			const id = parseInt(el.dataset.agencyId, 10);
			openAgencyModal(id);
		});
	});
}

function renderPagination(pageData) {
	const ul = $('#pagination');
	const { number, totalPages } = pageData;
	if (!totalPages || totalPages <= 1) {
		ul.innerHTML = '';
		return;
	}
	const btn = (label, page, disabled = false, active = false) => {
		const cls = ['page-numbers', disabled ? 'disabled' : '', active ? 'current' : ''].join(' ').trim();
		return `<li><a href="#" class="${cls}" data-page="${page}">${label}</a></li>`;
	};
	let html = '';
	html += btn('&laquo;', 0, number === 0);
	html += btn('&lsaquo;', Math.max(0, number - 1), number === 0);
	const start = Math.max(0, number - 2);
	const end = Math.min(totalPages - 1, number + 2);
	for (let i = start; i <= end; i++) html += btn((i + 1), i, false, i === number);
	html += btn('&rsaquo;', Math.min(totalPages - 1, number + 1), number === totalPages - 1);
	html += btn('&raquo;', totalPages - 1, number === totalPages - 1);
	ul.innerHTML = html;

	$$('#pagination a').forEach(a => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			const to = parseInt(a.dataset.page, 10);
			if (isNaN(to)) return;
			state.page = to;
			loadAgencies(); // ← 항상 가까운 순(백엔드 정렬) 그대로
			window.scrollTo({ top: $('#site-main').offsetTop - 120, behavior: 'smooth' });
		});
	});
}

// ===== 모달 =====
const modal = document.querySelector('.agency-search-modal');
const modalBg = document.querySelector('.agency-search-modal-background');
const closeModalBtn = document.querySelector('.agency-search-close-btn');

function openModal() {
	modal.classList.add('show');
	modalBg.classList.add('show');
}
function closeModal() {
	modal.classList.remove('show');
	modalBg.classList.remove('show');
}
closeModalBtn.addEventListener('click', closeModal);
modalBg.addEventListener('click', closeModal);

// 모달 오픈 & 지도 렌더
async function openAgencyModal(id) {
	const q = new URLSearchParams();
	if (state.userPos) { q.set('lat', state.userPos.lat); q.set('lng', state.userPos.lng); }
	const a = await fetchJSON(`/api/agencies/${id}?${q.toString()}`);

	pushRecent(a);
	renderRecent();

	const nameEl = $('#modal-agency-name');
	const addrEl = $('#modal-agency-address');
	const telEl = $('#modal-agency-tel');
	const mobEl = $('#modal-agency-mobile');
	const faxEl = $('#modal-agency-fax');     // ★ 추가
	const staffEl = $('#modal-agency-staff');
	const rowTel = $('#row-tel');
	const rowMob = $('#row-mobile');
	const rowFax = $('#row-fax');             // ★ 추가
	const rowStaff = $('#row-staff');
	const mapEl = $('#kakao-map');
	const callBtn = $('#modal-call-btn');
	const chatBtn = $('#modal-chat-btn');

	if (nameEl) nameEl.textContent = a.name ?? '-';

	const addrLine1 = a.roadAddress ?? '-';
	const addrLine2 = [a.addressDetail, a.postcode].filter(Boolean).join(' | ');
	if (addrEl) addrEl.textContent = `${addrLine1}\n${addrLine2 || '-'}`;

	// TEL
	if (a.tel?.trim()) { telEl.textContent = a.tel; rowTel.classList.remove('d-none'); }
	else rowTel.classList.add('d-none');

	// MOBILE
	if (a.mobile?.trim()) { mobEl.textContent = a.mobile; rowMob.classList.remove('d-none'); }
	else rowMob.classList.add('d-none');

	// FAX (★ 추가)
	if (faxEl && rowFax) {
		if (a.fax?.trim()) { faxEl.textContent = a.fax; rowFax.classList.remove('d-none'); }
		else rowFax.classList.add('d-none');
	}

	// STAFF
	if (a.staffName?.trim()) { staffEl.textContent = a.staffName; rowStaff.classList.remove('d-none'); }
	else rowStaff.classList.add('d-none');

	// 전화상담 버튼(우선순위: tel → mobile)
	if (callBtn) {
		let telLink = '';
		if (a.tel && a.tel.trim()) {
			telLink = 'tel:' + a.tel.replace(/[^0-9+]/g, '');
		} else if (a.mobile && a.mobile.trim()) {
			telLink = 'tel:' + a.mobile.replace(/[^0-9+]/g, '');
		}
		callBtn.disabled = !telLink;
		callBtn.onclick = () => { if (telLink) location.href = telLink; };
	}

	// 채팅상담 버튼
	if (chatBtn) {
		if (a.kakaoTalkLink && a.kakaoTalkLink.trim()) {
			chatBtn.href = a.kakaoTalkLink;
			chatBtn.classList.remove('disabled');
		} else {
			chatBtn.href = 'javascript:void(0);';
			chatBtn.classList.add('disabled');
		}
	}

	openModal();

	if (mapEl) mapEl.innerHTML = '';
	const lat = (a.latitude != null) ? parseFloat(a.latitude) : null;
	const lng = (a.longitude != null) ? parseFloat(a.longitude) : null;

	if (!state.kakaoReady || !window.kakao?.maps) {
		state.kakaoReady = await loadKakaoSdk();
	}

	const canDrawMap = lat != null && !Number.isNaN(lat)
		&& lng != null && !Number.isNaN(lng)
		&& state.kakaoReady && window.kakao?.maps;

	if (!canDrawMap) return;

	requestAnimationFrame(() => {
		setTimeout(() => {
			try {
				const center = new kakao.maps.LatLng(lat, lng);
				const map = new kakao.maps.Map(mapEl, { center, level: 3 });
				new kakao.maps.Marker({ position: center, map });
				map.relayout();
				map.setCenter(center);
			} catch (e) {
				console.error('[KAKAO] map draw failed', e);
			}
		}, 60);
	});
}

// ===== 필터 연동 (셀렉트 변경 시 "조회 안 함") =====
async function onProvinceChange() {
	const pid = $('#provinceSelect').value || '';
	state.provinceId = pid;
	state.cityId = '';
	state.districtId = '';
	$('#citySelect').innerHTML = `<option value="">지역 선택(시)</option>`;
	$('#districtSelect').innerHTML = `<option value="">지역 선택(구/군)</option>`;
	$('#citySelect').disabled = true;
	$('#districtSelect').disabled = true;

	// provinceName
	const sel = $('#provinceSelect');
	state.provinceName = pid ? sel.options[sel.selectedIndex].text : '';
	state.cityName = '';
	state.districtName = '';

	if (!pid) return;

	// 도시 목록 조회
	const cities = await fetchJSON(`/api/regions/cities?provinceId=${pid}`);
	if (cities.length > 0) {
		$('#citySelect').disabled = false;
		$('#citySelect').innerHTML = `<option value="">지역 선택(시)</option>` +
			cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
	} else {
		// City 없음 → District 바로
		const dists = await fetchJSON(`/api/regions/districts?provinceId=${pid}`);
		$('#districtSelect').disabled = false;
		$('#districtSelect').innerHTML = `<option value="">지역 선택(구/군)</option>` +
			dists.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
	}
}

async function onCityChange() {
	const cid = $('#citySelect').value || '';
	state.cityId = cid;
	state.districtId = '';
	$('#districtSelect').innerHTML = `<option value="">지역 선택(구/군)</option>`;
	$('#districtSelect').disabled = true;

	const sel = $('#citySelect');
	state.cityName = cid ? sel.options[sel.selectedIndex].text : '';
	state.districtName = '';

	if (cid) {
		const dists = await fetchJSON(`/api/regions/districts?provinceId=${state.provinceId}&cityId=${cid}`);
		$('#districtSelect').disabled = false;
		$('#districtSelect').innerHTML = `<option value="">지역 선택(구/군)</option>` +
			dists.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
	}
}

async function onDistrictChange() {
	const did = $('#districtSelect').value || '';
	state.districtId = did;
	const sel = $('#districtSelect');
	state.districtName = did ? sel.options[sel.selectedIndex].text : '';
}

function onPageSizeChange() {
	const size = parseInt($('#pageSizeSelect').value, 10);
	state.size = size;
	state.page = 0;
	// 페이지 사이즈 변경은 UX상 즉시 적용이 자연스러워서 바로 로딩
	loadAgencies();
}

function onSearch() {
	// (옵션) 텍스트 검색 input 사용 시
	const kwEl = $('#keywordInput');
	state.keyword = kwEl ? (kwEl.value || '') : '';
	state.page = 0;
	loadAgencies(); // ← 이 버튼으로만 조회!
}

function onNearby() {
	if (!state.userPos) {
		alert('브라우저 위치 권한이 필요합니다.');
		return;
	}
	// ‘항상 가까운 순’이므로 별도 플래그 없이 동일하게 조회
	state.page = 0;
	loadAgencies();
}

// ===== 이벤트 바인딩 =====
function bindEvents() {
	$('#provinceSelect')?.addEventListener('change', onProvinceChange);
	$('#citySelect')?.addEventListener('change', onCityChange);
	$('#districtSelect')?.addEventListener('change', onDistrictChange);
	$('#pageSizeSelect')?.addEventListener('change', onPageSizeChange);
	$('#searchBtn')?.addEventListener('click', onSearch);
	$('#nearbyBtn')?.addEventListener('click', onNearby);
}

// ===== 초기화 =====
(async function init() {
	bindEvents();
	// 위치 먼저 확보 → 최초 목록부터 “가까운 순”
	await checkGeoPermissionAndGuide(); // ← 추가
	state.userPos = await getUserLocation();
	state.kakaoReady = await loadKakaoSdk();
	renderRecent();
	await loadAgencies();
})();
