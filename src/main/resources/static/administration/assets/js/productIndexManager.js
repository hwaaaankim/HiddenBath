document.addEventListener('DOMContentLoaded', function () {
    // 중분류 동적 로드
    const bigSortSelect = document.getElementById('bigSortSelect');
    const middleSortSelect = document.getElementById('middleSortSelect');
    if (bigSortSelect) {
        bigSortSelect.addEventListener('change', function () {
            let bigId = bigSortSelect.value;
            middleSortSelect.innerHTML = '<option value="">== 중분류 선택 ==</option>';
            if (!bigId) return;
            fetch('/admin/searchMiddleSort', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'bigId=' + encodeURIComponent(bigId)
            })
            .then(res => res.json())
            .then(data => {
                data.forEach(function (item) {
                    let option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.name;
                    middleSortSelect.appendChild(option);
                });
            });
        });
    }

    // 필터 검색 (폼 submit)
    const sortFilterForm = document.getElementById('sortFilterForm');
    if (sortFilterForm) {
        sortFilterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let params = [];
            let bigId = bigSortSelect.value;
            let middleId = middleSortSelect.value;
            if (bigId) params.push('bigId=' + encodeURIComponent(bigId));
            if (middleId) params.push('middleId=' + encodeURIComponent(middleId));
            location.href = '/admin/productIndexManager' + (params.length ? '?' + params.join('&') : '');
        });
    }

    // 드래그앤드랍 대상 리스트의 "최초 렌더링 순서" 저장 (oldIdList)
    let oldIdList = [];
    document.querySelectorAll('#productIndexList .list-group-item').forEach(function(item) {
        oldIdList.push(Number(item.getAttribute('data-id')));
    });

    // 드래그 앤 드랍 구현
    let sortable = new Sortable(document.getElementById('productIndexList'), {
        animation: 150,
        onEnd: function (evt) {
            document.getElementById('indexChangeBtn').disabled = false;
        }
    });

    // 인덱스 변경 처리
    const indexChangeBtn = document.getElementById('indexChangeBtn');
    if (indexChangeBtn) {
        indexChangeBtn.addEventListener('click', function () {
            // 드래그 후 현재 순서(newIdList)
            const list = document.querySelectorAll('#productIndexList .list-group-item');
            let newIdList = [];
            list.forEach(item => newIdList.push(Number(item.getAttribute('data-id'))));
            if (!confirm('현재 순서로 인덱스를 교환하시겠습니까?')) return;

            fetch('/admin/productIndexChange', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({oldIdList: oldIdList, newIdList: newIdList})
            })
            .then(res => res.text())
            .then(result => {
                if (result === 'ok') {
                    alert('정상적으로 인덱스가 변경되었습니다.');
                    location.reload();
                } else {
                    alert('실패: ' + result);
                }
            })
            .catch(err => {
                alert('에러가 발생했습니다.');
            });
        });
    }
});
