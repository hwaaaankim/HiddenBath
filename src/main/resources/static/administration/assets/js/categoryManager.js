
$(function(){
	$('#bigSortDeleteBtn').attr('disabled', true);
	$('#bigSortDeleteSelect').on('change', function(){
		$('#bigSortDeleteBtn').attr('disabled', false);
		var arr = new Array();
		arr = $('#productSizeSelect').val();
		console.log(arr);
	});
});