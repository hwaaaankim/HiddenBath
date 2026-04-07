document.getElementById("search-big").addEventListener("change", function() {
	const bigId = this.value;
	const middleSelect = document.getElementById("search-middle");
	middleSelect.innerHTML = "<option value=''>== 중분류 선택 ==</option>";

	if (bigId) {
		fetch(`/admin/searchMiddleSort?bigId=${bigId}`)
			.then(res => res.json())
			.then(data => {
				data.forEach(m => {
					const option = document.createElement("option");
					option.value = m.id;
					option.textContent = m.name;
					middleSelect.appendChild(option);
				});
			});
	}
});

function deleteProduct(elem) {
	const productId = elem.getAttribute("data-id");
	if (confirm("정말 삭제하시겠습니까?")) {
		fetch(`/admin/productDelete/${productId}`, { method: "DELETE" })
			.then(res => {
				if (res.ok) location.reload();
				else alert("삭제 실패");
			});
	}
}