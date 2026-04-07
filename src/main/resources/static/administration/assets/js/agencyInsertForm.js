// ===== 공통 유틸 =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/** Blob(JSON)과 파일 포함 FormData 내용을 사람이 읽기 좋게 출력 */
async function dumpFormData(fd) {
	const entries = [];
	for (const [k, v] of fd.entries()) {
		if (k === 'form' && v instanceof Blob) {
			const jsonText = await v.text();
			let json; try { json = JSON.parse(jsonText); } catch { json = jsonText; }
			entries.push([k, json]);        // JSON은 객체로 출력
		} else if (v instanceof File) {
			entries.push([k, { name: v.name, size: v.size, type: v.type }]);
		} else {
			entries.push([k, v]);
		}
	}
	console.group('[AgencyInsert] FormData dump');
	console.table(Object.fromEntries(entries));
	console.groupEnd();
}

/** 주소 필드 값, 좌표 값, 시/도·시/군/구 값 점검용 */
function logAddressFields(where = '') {
	console.group(`[AgencyInsert] ${where} address snapshot`);
	console.table({
		postcode: $('#postcode')?.value,
		roadAddress: $('#roadAddress')?.value,
		jibunAddress: $('#jibunAddress')?.value,
		sido: $('#sido')?.value,
		sigungu: $('#sigungu')?.value,
		bname: $('#bname')?.value,
		latitude: $('#latitude')?.value,
		longitude: $('#longitude')?.value,
	});
	console.groupEnd();
}


/** Kakao SDK 동적 로드 (최종판: HTTPS 강제 + autoload=false + 중복/경합 방지) */
function loadKakaoSdk() {
	return new Promise((resolve) => {
		if (window.kakao?.maps?.services) return resolve(true);

		if (!window.KAKAO_JS_KEY || window.KAKAO_JS_KEY.length < 10) {
			console.warn("Kakao JS KEY 미설정. 지오코딩 불가");
			return resolve(false);
		}

		const exist = document.getElementById('kakao-sdk');
		if (exist) {
			if (window.kakao?.maps?.load) {
				window.kakao.maps.load(() => resolve(true));
			} else {
				exist.addEventListener('load', () => {
					if (window.kakao?.maps?.load) {
						window.kakao.maps.load(() => resolve(true));
					} else {
						resolve(!!window.kakao?.maps?.services);
					}
				}, { once: true });
				exist.addEventListener('error', (e) => {
					console.error('Kakao SDK 기존 스크립트 오류:', e);
					resolve(false);
				}, { once: true });
			}
			return;
		}

		const script = document.createElement('script');
		script.id = 'kakao-sdk';
		script.async = true;
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(window.KAKAO_JS_KEY)}&libraries=services&autoload=false`;

		script.onload = () => {
			try {
				if (!window.kakao?.maps?.load) {
					console.error('kakao.maps.load 없음 → 키 유형/도메인 등록 상태 점검 필요');
					return resolve(false);
				}
				window.kakao.maps.load(() => resolve(true));
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

/** Daum Postcode 열기 */
function openDaumPost() {
	new daum.Postcode({
		oncomplete: async function(data) {
			try {
				// 1) 주소 필드 매핑
				$('#postcode').value = data.zonecode || '';
				$('#roadAddress').value = data.roadAddress || '';
				$('#jibunAddress').value = data.jibunAddress || '';
				$('#sido').value = data.sido || '';
				$('#sigungu').value = data.sigungu || '';
				$('#bname').value = data.bname || '';
				
				logAddressFields('after DaumPost');
				// ✅ 상세주소는 사용자 입력을 우선 보존 (비어 있을 때만 제안값 채움)
				const detailEl = $('#addressDetail');
				if (detailEl && !detailEl.value.trim()) {
					const suggestion = (data.buildingName && data.apartment === 'Y') ? data.buildingName : '';
					detailEl.value = suggestion;
				}

				// 2) 자동 지오코딩
				const ok = await loadKakaoSdk();
				if (!ok) {
					alert('카카오 키가 없어 좌표를 자동으로 설정할 수 없습니다.');
					return;
				}
				const addr = $('#roadAddress').value.trim();
				if (!addr) {
					alert('도로명 주소가 비어 있어 좌표를 설정할 수 없습니다.');
					return;
				}
				const geocoder = new kakao.maps.services.Geocoder();
				geocoder.addressSearch(addr, function(result, status) {
					if (status === kakao.maps.services.Status.OK && result && result[0]) {
						$('#latitude').value = result[0].y; // 위도
						$('#longitude').value = result[0].x; // 경도
					} else {
						alert('지오코딩 실패: 주소를 확인해 주세요.');
					}
				});
			} catch (e) {
				console.error('주소검색 처리 오류:', e);
				alert('주소 처리 중 오류가 발생했습니다.');
			}
		}
	}).open();
}

/** 수동 지오코딩(보조 버튼) */
async function doGeocode() {
	try {
		const ok = await loadKakaoSdk();
		if (!ok) {
			alert('카카오 지도 서비스를 사용할 수 없습니다. (키 설정 필요)');
			return;
		}
		const addr = $('#roadAddress').value.trim();
		if (!addr) {
			alert('도로명 주소가 비어 있습니다.');
			return;
		}
		const geocoder = new kakao.maps.services.Geocoder();
		geocoder.addressSearch(addr, function(result, status) {
			if (status === kakao.maps.services.Status.OK && result && result[0]) {
				$('#latitude').value = result[0].y;  // 위도
				$('#longitude').value = result[0].x;  // 경도
				alert('좌표가 설정되었습니다.');
			} else {
				alert('지오코딩 실패: 주소를 확인해 주세요.');
			}
		});
	} catch (e) {
		console.error('지오코딩 오류:', e);
		alert('지오코딩 처리 중 오류가 발생했습니다.');
	}
}

/** 아이콘 미리보기 */
function bindIconPreview() {
	const input = $('#iconFile');
	const img = $('#agency-icon-preview');
	input.addEventListener('change', () => {
		const f = input.files && input.files[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = e => { img.src = e.target.result; };
		reader.readAsDataURL(f);
	});
}

/** 등록 전송 */
async function submitForm() {
	const name = $('#name').value.trim();
	if (!name) {
		alert('대리점명을 입력해 주세요.');
		$('#name').focus();
		return;
	}

	const payload = {
		name,
		postcode: $('#postcode').value.trim(),
		roadAddress: $('#roadAddress').value.trim(),
		jibunAddress: $('#jibunAddress').value.trim(),
		addressDetail: $('#addressDetail').value.trim(), // ✅ 사용자 입력 허용
		sido: $('#sido').value.trim(),
		sigungu: $('#sigungu').value.trim(),
		bname: $('#bname').value.trim(),
		latitude: $('#latitude').value ? Number($('#latitude').value) : null,
		longitude: $('#longitude').value ? Number($('#longitude').value) : null,
		tel: $('#tel').value.trim(),
		mobile: $('#mobile').value.trim(),
		fax: $('#fax') ? $('#fax').value.trim() : "",
		kakaoTalkLink: $('#kakaoTalkLink').value.trim(),
		staffName: $('#staffName').value.trim()
	};

	const fd = new FormData();
	fd.append('form', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
	const icon = $('#iconFile').files[0];
	if (icon) fd.append('icon', icon);
	logAddressFields('before submit');
	await dumpFormData(fd);
	const resp = await fetch('/admin/api/agencies', { method: 'POST', body: fd });
	if (!resp.ok) {
		const msg = await resp.text().catch(() => '');
		alert('등록 실패: ' + msg);
		return;
	}
	alert('대리점이 등록되었습니다.');
	location.href = '/admin/agencyManager';
}

/* ==== 이벤트 바인딩 ==== */
document.addEventListener('DOMContentLoaded', () => {
	// 전역 키 확보
	window.KAKAO_JS_KEY = window.KAKAO_JS_KEY || (typeof KAKAO_JS_KEY !== 'undefined' ? KAKAO_JS_KEY : '');

	// ✅ 주소 항목 readonly 설정 (상세주소는 제외)
	['postcode', 'roadAddress', 'jibunAddress', 'sido', 'sigungu', 'bname', 'latitude', 'longitude']
		.forEach(id => { const el = $('#' + id); if (el) el.setAttribute('readonly', 'readonly'); });
	// 상세주소는 편집 가능하도록 보장
	const detailEl = $('#addressDetail');
	if (detailEl) detailEl.removeAttribute('readonly');

	// 주소 검색 버튼
	$('#btnFindAddress').addEventListener('click', openDaumPost);

	// 보조용 좌표조회 버튼
	$('#btnGeocode').addEventListener('click', (e) => { e.preventDefault(); doGeocode(); });

	// 등록
	$('#btnSubmit').addEventListener('click', submitForm);

	// 아이콘 미리보기
	bindIconPreview();
});
