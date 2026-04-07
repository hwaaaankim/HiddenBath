/*var btn = document.getElementById('productSizeBtn');
var val = document.getElementById('productSizes');


btn.addEventListener('click', function(){
	var arr = val.value.split(',');
	$.ajax({
		url:'/admin/productSizeInsert',
		async:false,
		method:'post',
		dataType:'json',
		traditional:true,
		data:{
			size : arr,
		},success:function(result,status){
		},error:function(request, response, error){
		}
	});
})
*/
$(function(){
	$('#productSizeDelBtn').attr('disabled', true);
	$('#productSizeSelect').on('change', function(){
		$('#productSizeDelBtn').attr('disabled', false);
		var arr = new Array();
		arr = $('#productSizeSelect').val();
		console.log(arr);
	});
});