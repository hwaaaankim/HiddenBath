// productInsert.js (전체)
(function() {
	'use strict';

	/* ========== 1) 카테고리: 대분류 -> 중분류 동적 로드 (jQuery) ========== */
	(function bindCategoryAjax() {
		if (!window.jQuery) return;
		const $ = window.jQuery;
		$('#bigSort').on('change', function() {
			$.ajax({
				cache: false,
				type: 'POST',
				url: '/admin/searchMiddleSort',
				data: { bigId: $(this).val() },
				success: function(result) {
					const $mid = $('#middleSort');
					$mid.find('option').remove();
					$mid.append("<option value=''> === 중분류 선택 === </option>");
					for (let i = 0; i < result.length; i++) {
						const option = $("<option/>", {
							value: result[i].id,
							text: result[i].name
						});
						$mid.append(option);
					}
				}
			});
		});
	})();

	/* ========== 2) 멀티셀렉트 초기화 (multi.js) ========== */
	(function initMultiSelects() {
		const multiSelectHeader = document.getElementById('multiselect-header');
		if (multiSelectHeader && window.multi) {
			window.multi(multiSelectHeader, {
				non_selected_header: '등록가능사이즈',
				selected_header: '등록된 사이즈'
			});
		}

		const multiSelectHeader02 = document.getElementById('multiselect-header02');
		if (multiSelectHeader02 && window.multi) {
			window.multi(multiSelectHeader02, {
				non_selected_header: '등록가능색상',
				selected_header: '등록된 색상'
			});
		}

		const multiSelectHeader03 = document.getElementById('multiselect-header03');
		if (multiSelectHeader03 && window.multi) {
			window.multi(multiSelectHeader03, {
				non_selected_header: '등록가능옵션',
				selected_header: '등록된 옵션'
			});
		}

		const multiSelectHeader04 = document.getElementById('multiselect-header04');
		if (multiSelectHeader04 && window.multi) {
			window.multi(multiSelectHeader04, {
				non_selected_header: '등록가능태그',
				selected_header: '등록된 태그'
			});
		}
	})();

	/* ========== 3) 대표이미지(단일) 미리보기 ========== */
	(function bindMainImagePreview() {
		const input = document.getElementById('product-image-input');
		const preview = document.getElementById('product-image-preview');
		if (!input || !preview) return;

		input.addEventListener('change', function() {
			preview.innerHTML = '';
			if (!this.files || !this.files[0]) return;

			const file = this.files[0];
			const url = URL.createObjectURL(file);
			const wrapper = document.createElement('div');
			wrapper.style.position = 'relative';

			const img = document.createElement('img');
			img.src = url;
			img.style.width = '150px';
			img.style.height = 'auto';
			img.classList.add('rounded', 'border');

			const delBtn = document.createElement('button');
			delBtn.type = 'button';
			delBtn.innerHTML = '&times;';
			delBtn.style.position = 'absolute';
			delBtn.style.top = '0px';
			delBtn.style.right = '0px';
			delBtn.className = 'btn btn-sm btn-danger';
			delBtn.onclick = function() {
				input.value = '';
				preview.innerHTML = '';
			};

			wrapper.appendChild(img);
			wrapper.appendChild(delBtn);
			preview.appendChild(wrapper);
		});
	})();

	/* ========== 4) 도면 파일(이미지 or PDF, 단일) 미리보기 ========== */
	(function bindDrawingFilePreview() {
		// ★ HTML에서 id가 'drawing-file-input', 'drawing-file-preview'여야 합니다.
		const input = document.getElementById('drawing-file-input');
		const preview = document.getElementById('drawing-file-preview');
		if (!input || !preview) return;

		input.addEventListener('change', render);

		function render() {
			preview.innerHTML = '';
			if (!input.files || !input.files[0]) return;

			const file = input.files[0];
			const name = file.name || '';
			const isPdf =
				/\.pdf$/i.test(name) ||
				(file.type && file.type.toLowerCase().includes('pdf'));
			const url = URL.createObjectURL(file);

			if (isPdf) {
				// PDF는 리스트 형태(파일명/열기/삭제)
				const row = document.createElement('div');
				row.className =
					'd-flex align-items-center justify-content-between border rounded p-2';

				const left = document.createElement('div');
				left.className = 'd-flex align-items-center gap-2';

				const badge = document.createElement('span');
				badge.className = 'badge bg-danger-subtle text-danger-emphasis';
				badge.textContent = 'PDF';

				const filename = document.createElement('span');
				filename.textContent = name;

				left.appendChild(badge);
				left.appendChild(filename);

				const right = document.createElement('div');
				right.className = 'd-flex align-items-center gap-2';

				const openBtn = document.createElement('a');
				openBtn.href = url;
				openBtn.target = '_blank';
				openBtn.rel = 'noopener';
				openBtn.className = 'btn btn-sm btn-secondary';
				openBtn.textContent = '열기';

				const delBtn = document.createElement('button');
				delBtn.type = 'button';
				delBtn.className = 'btn btn-sm btn-danger';
				delBtn.textContent = '삭제';
				delBtn.onclick = function() {
					input.value = '';
					preview.innerHTML = '';
				};

				right.appendChild(openBtn);
				right.appendChild(delBtn);

				row.appendChild(left);
				row.appendChild(right);
				preview.appendChild(row);
			} else {
				// 이미지면 썸네일
				const wrapper = document.createElement('div');
				wrapper.style.position = 'relative';
				wrapper.style.display = 'inline-block';

				const img = document.createElement('img');
				img.src = url;
				img.style.width = '150px';
				img.style.height = 'auto';
				img.classList.add('rounded', 'border');

				const delBtn = document.createElement('button');
				delBtn.type = 'button';
				delBtn.innerHTML = '&times;';
				delBtn.style.position = 'absolute';
				delBtn.style.top = '0px';
				delBtn.style.right = '0px';
				delBtn.className = 'btn btn-sm btn-danger';
				delBtn.onclick = function() {
					input.value = '';
					preview.innerHTML = '';
				};

				wrapper.appendChild(img);
				wrapper.appendChild(delBtn);
				preview.appendChild(wrapper);
			}
		}
	})();

	/* ========== 5) 슬라이드이미지(multiple) 미리보기 + 개별 삭제 ========== */
	(function bindSlideImagesPreview() {
		const inputId = 'slide-image-input';
		const previewId = 'slide-image-preview';

		let input = document.getElementById(inputId);
		const preview = document.getElementById(previewId);
		if (!input || !preview) return;

		input.addEventListener('change', function() {
			render(Array.from(this.files));
		});

		function render(fileArr) {
			preview.innerHTML = '';
			fileArr.forEach((file, idx) => {
				const url = URL.createObjectURL(file);
				const wrapper = document.createElement('div');
				wrapper.style.position = 'relative';
				wrapper.style.display = 'inline-block';
				wrapper.style.marginRight = '8px';
				wrapper.style.marginBottom = '8px';

				const img = document.createElement('img');
				img.src = url;
				img.style.width = '150px';
				img.style.height = 'auto';
				img.classList.add('rounded', 'border');

				const delBtn = document.createElement('button');
				delBtn.type = 'button';
				delBtn.innerHTML = '&times;';
				delBtn.style.position = 'absolute';
				delBtn.style.top = '0px';
				delBtn.style.right = '0px';
				delBtn.className = 'btn btn-sm btn-danger';

				delBtn.onclick = function() {
					// 배열에서 제거
					fileArr.splice(idx, 1);

					// input 재생성(파일리스트 갱신)
					const newInput = document.createElement('input');
					newInput.type = 'file';
					newInput.className = input.className;
					newInput.id = input.id;
					newInput.name = input.name;
					newInput.accept = input.accept;
					newInput.setAttribute('multiple', '');

					const dt = new DataTransfer();
					fileArr.forEach((f) => dt.items.add(f));
					newInput.files = dt.files;

					input.parentNode.replaceChild(newInput, input);
					input = newInput;

					input.addEventListener('change', function() {
						render(Array.from(this.files));
					});

					render(fileArr);
				};

				wrapper.appendChild(img);
				wrapper.appendChild(delBtn);
				preview.appendChild(wrapper);
			});
		}
	})();

	/* ========== 6) 제품코드 중복 체크 + 제출 차단 ========== */
	(function bindProductCodeValidation() {
		const codeInput = document.getElementById('product-code-input');
		const codeMsg = document.getElementById('product-code-check-msg');
		const form = document.getElementById('productInsertForm');

		if (!codeInput || !codeMsg || !form) return;

		let isProductCodeValid = false;

		// 입력 중엔 유효성 보류
		codeInput.addEventListener('input', function() {
			isProductCodeValid = false;
			codeMsg.textContent = '';
		});

		codeInput.addEventListener('focusout', function() {
			const code = this.value.trim();
			if (!code) {
				codeMsg.textContent = '';
				isProductCodeValid = false;
				return;
			}
			fetch(`/admin/code-duplicate?code=${encodeURIComponent(code)}`)
				.then((res) => res.json())
				.then((isDuplicate) => {
					if (isDuplicate) {
						codeMsg.textContent = '이미 사용 중인 코드입니다.';
						codeMsg.style.color = '#e74c3c';
						isProductCodeValid = false;
					} else {
						codeMsg.textContent = '사용 가능한 코드입니다.';
						codeMsg.style.color = '#27ae60';
						isProductCodeValid = true;
					}
				})
				.catch(() => {
					codeMsg.textContent = '중복체크 실패(네트워크 오류)';
					codeMsg.style.color = '#e74c3c';
					isProductCodeValid = false;
				});
		});

		form.addEventListener('submit', function(e) {
			if (!isProductCodeValid) {
				e.preventDefault();
				codeMsg.textContent = '제품코드 중복체크를 통과해야 합니다.';
				codeMsg.style.color = '#e74c3c';
				codeInput.focus();
				return false;
			}
		});
	})();
})();
