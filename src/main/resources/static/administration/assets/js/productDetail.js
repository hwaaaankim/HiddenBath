// 1. 대분류 변경 시 중분류 자동 로딩
$('#bigSort').on('change', function () {
    $.ajax({
        cache: false,
        type: 'POST',
        url: '/admin/searchMiddleSort',
        data: { bigId: $(this).val() },
        success: function (result) {
            $('#middleSort').find('option').remove();
            $('#middleSort').append("<option value=''> === 중분류 선택 === </option>");
            for (var i = 0; i < result.length; i++) {
                var option = $("<option value=" + result[i].id + ">" + result[i].name + "</option>");
                $('#middleSort').append(option);
            }
        }
    });
});

// 2. multi.js 셀렉트 초기화
['#multiselect-header', '#multiselect-header02', '#multiselect-header03', '#multiselect-header04'].forEach(function (id, idx) {
    var ele = document.querySelector(id);
    if (ele) {
        multi(ele, {
            non_selected_header: ['등록가능사이즈', '등록가능색상', '등록가능옵션', '등록가능태그'][idx],
            selected_header: ['등록된 사이즈', '등록된 색상', '등록된 옵션', '등록된 태그'][idx]
        });
    }
});

// 3. 대표이미지
const productImageInput = document.getElementById('product-image-input');
const productImagePreview = document.getElementById('product-image-preview');
const deleteRepImageInput = document.getElementById('deleteRepImage');

$('#product-image-preview').on('click', '.del-rep-img-btn', function () {
    $('.rep-img-origin').remove();
    $('#deleteRepImage').val('true');
    productImageInput.value = '';
});

// 대표이미지 새 파일 선택(변경)
productImageInput.addEventListener('change', function () {
    $('.rep-img-origin').remove();
    $('#deleteRepImage').val('false');
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const url = URL.createObjectURL(file);
        const wrapper = document.createElement('div');
        wrapper.className = 'position-relative rep-img-origin';
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '150px';
        img.style.height = 'auto';
        img.classList.add('rounded', 'border');
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = '&times;';
        delBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 del-rep-img-btn';
        delBtn.onclick = function () {
            productImageInput.value = '';
            wrapper.remove();
            $('#deleteRepImage').val('true');
        };
        wrapper.appendChild(img); wrapper.appendChild(delBtn);
        productImagePreview.appendChild(wrapper);
    }
});

// 4. 도면 파일 (이미지 or PDF, 단일) — 상세/등록 공통
const drawingImageInput = document.getElementById('drawing-image-input');   // 기존 id 유지
const drawingImagePreview = document.getElementById('drawing-image-preview');
const deleteDrawingImageInput = document.getElementById('deleteDrawingImage');

// (상세페이지에서 기존 파일 삭제 버튼) 위임 이벤트
$('#drawing-image-preview').on('click', '.del-drawing-file-btn', function () {
  // 기존 렌더(이미지든 PDF든) 공통 래퍼 클래스
  $('.drawing-file-origin').remove();
  $('#deleteDrawingImage').val('true');
  if (drawingImageInput) drawingImageInput.value = '';
});

// (신규 선택 시 미리보기)
if (drawingImageInput && drawingImagePreview) {
  drawingImageInput.addEventListener('change', function () {
    // 기존 표시 제거
    $('.drawing-file-origin').remove();
    $('#deleteDrawingImage').val('false');

    if (!(this.files && this.files[0])) return;

    const file = this.files[0];
    const name = file.name || '';
    const isPdf = /\.pdf$/i.test(name) || (file.type && file.type.toLowerCase().includes('pdf'));
    const url = URL.createObjectURL(file);

    // 공통 래퍼 (삭제 위임과 동일 클래스)
    const wrapper = document.createElement('div');
    wrapper.className = 'position-relative drawing-file-origin';

    if (isPdf) {
      // PDF: 리스트형
      wrapper.classList.add('border', 'rounded', 'p-2', 'd-flex', 'align-items-center', 'justify-content-between');

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
      delBtn.className = 'btn btn-sm btn-danger del-drawing-file-btn';
      delBtn.textContent = '삭제';

      right.appendChild(openBtn);
      right.appendChild(delBtn);

      wrapper.appendChild(left);
      wrapper.appendChild(right);
      drawingImagePreview.appendChild(wrapper);
    } else {
      // 이미지: 썸네일
      const img = document.createElement('img');
      img.src = url;
      img.style.width = '150px';
      img.style.height = 'auto';
      img.classList.add('rounded', 'border');

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.innerHTML = '&times;';
      delBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0 del-drawing-file-btn';

      wrapper.appendChild(img);
      wrapper.appendChild(delBtn);
      drawingImagePreview.appendChild(wrapper);
    }
  });
}


// 5. 슬라이드 이미지 (삭제, 신규업로드 완전반영)
function addDeleteSlideImageId(imageId) {
    const hiddenInput = document.getElementById('deleteSlideImageIds');
    let currentVal = hiddenInput.value ? hiddenInput.value.split(',') : [];
    if (!currentVal.includes(String(imageId))) {
        currentVal.push(imageId);
        hiddenInput.value = currentVal.join(',');
    }
}
$('#slide-image-preview').on('click', '.del-slide-img-btn', function () {
    const parent = $(this).closest('.slide-img-origin');
    const imgId = parent.data('id');
    addDeleteSlideImageId(imgId);
    parent.remove();
});

// input에서 새 파일 선택시 기존 슬라이드 이미지 미리보기(및 삭제대상) 전체삭제, 기존 이미지 id 전부 삭제요청에 추가
const slideImageInput = document.getElementById('slide-image-input');
const slideImagePreview = document.getElementById('slide-image-preview');
slideImageInput.addEventListener('change', function () {
    // 기존 슬라이드 이미지 전체 삭제 요청(변경시 기존 이미지 완전 교체)
    $('.slide-img-origin').each(function () {
        addDeleteSlideImageId($(this).data('id'));
    });
    $('.slide-img-origin').remove();
    $('.new-slide-img').remove(); // ★★★ 이 부분 추가 (이전 새파일 미리보기 전부 삭제)

    // 새 업로드 파일 미리보기 표시
    Array.from(this.files).forEach(function (file, idx) {
        const url = URL.createObjectURL(file);
        const wrapper = document.createElement('div');
        wrapper.className = 'position-relative new-slide-img';
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '150px';
        img.style.height = 'auto';
        img.classList.add('rounded', 'border');
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = '&times;';
        delBtn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0';
        delBtn.onclick = function () {
            // 선택한 파일만 미리보기에서 제거, input value 도 동적으로 변경
            let dt = new DataTransfer();
            let arr = Array.from(slideImageInput.files);
            arr.splice(idx, 1);
            arr.forEach(f => dt.items.add(f));
            slideImageInput.files = dt.files;
            wrapper.remove();
        };
        wrapper.appendChild(img); wrapper.appendChild(delBtn);
        slideImagePreview.appendChild(wrapper);
    });
});


// 6. 제품코드 중복체크
let isProductCodeValid = false;
const codeInput = document.getElementById('product-code-input');
const codeMsg = document.getElementById('product-code-check-msg');
const form = document.getElementById('productDetailForm');

// 1. 페이지 로드 시 원본 코드 기억
const originalProductCode = codeInput.value.trim();

codeInput.addEventListener('focusout', function () {
    const code = this.value.trim();
    if (!code) {
        codeMsg.textContent = '';
        isProductCodeValid = false;
        return;
    }
    // 기존 값과 같으면 중복체크 건너뜀
    if (code === originalProductCode) {
        codeMsg.textContent = '';
        isProductCodeValid = true;
        return;
    }
    // 변경된 경우에만 중복체크 (productId 포함)
    const productId = document.querySelector('input[name="productId"]').value;
    fetch(`/admin/code-duplicate?code=${encodeURIComponent(code)}&productId=${encodeURIComponent(productId)}`)
        .then(res => res.json())
        .then(isDuplicate => {
            if (isDuplicate) {
                codeMsg.textContent = "이미 사용 중인 코드입니다.";
                codeMsg.style.color = "#e74c3c";
                isProductCodeValid = false;
            } else {
                codeMsg.textContent = "사용 가능한 코드입니다.";
                codeMsg.style.color = "#27ae60";
                isProductCodeValid = true;
            }
        }).catch(e => {
            codeMsg.textContent = "중복체크 실패(네트워크 오류)";
            codeMsg.style.color = "#e74c3c";
            isProductCodeValid = false;
        });
});

form.addEventListener('submit', function (e) {
    // 1) 대표이미지 반드시 1장 체크
    const hasOrigin = $('.rep-img-origin').length > 0;
    const hasNewFile = productImageInput.files && productImageInput.files[0];
    if (!hasOrigin && !hasNewFile) {
        alert('대표이미지는 반드시 1장 등록되어야 합니다.');
        e.preventDefault();
        return false;
    }

    // **슬라이드 이미지 반드시 1장 이상 체크**
    const hasOriginSlide = $('.slide-img-origin').length > 0;
    const hasNewSlide = slideImageInput.files && slideImageInput.files.length > 0;
    if (!hasOriginSlide && !hasNewSlide) {
        alert('슬라이드 이미지는 최소 1장 이상 등록되어야 합니다.');
        e.preventDefault();
        return false;
    }

    // 2) 제품코드 중복체크 (코드가 기존과 다르면, 반드시 중복체크 값이 true여야 함)
    const currentCode = codeInput.value.trim();
    if (currentCode !== originalProductCode && !isProductCodeValid) {
        e.preventDefault();
        codeMsg.textContent = "제품코드 중복체크를 통과해야 합니다.";
        codeMsg.style.color = "#e74c3c";
        codeInput.focus();
        return false;
    }
    // (동일하면 바로 통과, 변경된 경우 중복체크 값이 true여야 통과)

    // 3) 도면이미지는 선택사항 (required 아님, 필요시 추가 가능)
});


