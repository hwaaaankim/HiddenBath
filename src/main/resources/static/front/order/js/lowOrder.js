	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		$('#submitBtn').attr('disabled', true);
		$('form#wrapped').attr('POST', '/order/lowOrderInsert');
		$("#wizard_container").wizard({
			stepsWrapper: "#wrapped",
			submit: ".submit",
			beforeSelect: function (event, state) {
				console.log(state.stepIndex);
				if ($('input#website').val().length != 0) {
					return false;
				}
				if (!state.isMovingForward)
					return true;
				var inputs = $(this).wizard('state').step.find(':input');
				return !inputs.length || !!inputs.valid();
			},
			afterSelect:function(event, state){
				if(state.stepIndex === 16){
					$('#submitBtn').attr('disabled', false);
				}else{
					$('#submitBtn').attr('disabled', true);
				}
				if(state.stepIndex === 15){
					if($('input[name=model]:checked').attr('id')!=undefined){
						$('#lowModel').val('하부장 모델 : ' + $('input[name=model]').attr('id'));
					}
					
					if($('input[name=color]:checked').attr('id')!=undefined){
						$('#lowColor').val('하부장 색상 : ' + $('input[name=color]').attr('id'));
					}
					
					if($('input[name=form]:checked').attr('id')!=undefined){
						$('#lowForm').val('하부장 형태 : ' + $('input[name=form]').attr('id'));
					}
					
					$('#lowWidth').val('가로길이 : ' + $('input[name=lowWidth]').val() + "[단위 : mm]");
					$('#lowHeight').val('세로길이 : ' + $('input[name=lowHeight]').val() + "[단위 : mm]");
					$('#lowDepth').val('깊이 : ' + $('input[name=lowDepth]').val() + "[단위 : mm]");
					
					
					if($('input[name=marble_color]:checked').attr('id')!=undefined){
						$('#lowMarbleColor').val('대리석 색상 : ' + $('input[name=marble_color]').attr('id'));
					}
					
					if($('input[name=washstand]:checked').attr('id')!=undefined){
						$('#lowWashstand').val('세면대 : ' + $('input[name=color]').attr('id'));
					}
					
					if($('input[name=washstand_topball]:checked').attr('id')!=undefined){
						$('#lowTopWashstand').val('탑볼형 세면대 : ' + $('input[name=washstand_topball]:checked').attr('id'));
					}else{
						$('#lowTopWashstand').val('탑볼형 세면대 : 해당없음');
					}
					
					if($('input[name=washstand_direction]:checked').attr('id')!=undefined){
						$('#lowWashstandPosition').val('LED 색상 : ' + $('input[name=washstand_direction]:checked').attr('id'));
					}
					
					
					if($('input[name=door]:checked').attr('id')!=undefined){
						$('#lowDoor').val('도어 종류 : ' + $('input[name=door]:checked').attr('id'));
					}else{
						$('#lowDoor').val('도어 종류 : 해당없음');
					}
					
					if($('input[name=door_count]:checked').attr('id')!=undefined){
						$('#lowDoorCount').val('도어 개수 : ' + $('input[name=door_count]:checked').attr('id'));
					}else{
						$('#lowDoorCount').val('도어 개수 : 해당없음');
					}
					
					if($('input[name=handle]:checked').attr('id')!=undefined){
						$('#lowHandle').val('손잡이 : ' + $('input[name=handle]:checked').attr('id'));
					}
					
					if($('input[name=handle_color]:checked').attr('id')!=undefined){
						$('#lowHandleColor').val('손잡이 색상 : ' + $('input[name=handle_color]:checked').attr('id'));
					}else{
						$('#lowHandleColor').val('손잡이 색상 : 해당없음');
					}
					
				}
			}
		}).validate({
			errorPlacement: function (error, element) {
				if (element.is(':radio') || element.is(':checkbox')) {
					error.insertBefore(element.next());
				} else {
					error.insertAfter(element);
				}
			}
		});
	});
	$('#submitBtn').on('click', function(){
		var result = confirm("제출 하시겠습니까?");
		if(result){
			
		
		var lowForm = $('<form></form>');
		// set attribute (form) 
		lowForm.attr("method", "post");
		lowForm.attr("action", "/order/lowOrderInsert");
		
		// create element & set attribute (input) 
		lowForm.append($('<input/>', {type: 'hidden', name: 'orderType', value: 'LOW' })); // 주문 유형을 나타내는 필드
		lowForm.append($('<input/>', {type: 'hidden', name: 'model', value: $('#lowModel').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'color', value: $('#lowColor').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowForm', value: $('#lowForm').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'width', value: $('#lowWidth').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'height', value: $('#lowHeight').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'depth', value: $('#lowDepth').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowMarbleColor', value: $('#lowMarbleColor').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowWashstand', value: $('#lowWashstand').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowWashstandTopball', value: $('#lowTopWashstand').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowWashstandDirection', value: $('#lowWashstandPosition').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowDoor', value: $('#lowDoor').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowDoorCount', value: $('#lowDoorCount').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowHandle', value: $('#lowHandle').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'lowHandleColor', value: $('#lowHandleColor').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'name', value: $('#name').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'phone', value: $('#phone').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'email', value: $('#email').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'message', value: $('#message').val() }));
		lowForm.append($('<input/>', {type: 'hidden', name: 'subject', value: '하부장 비규격주문' }));
		
		lowForm.appendTo('body');
		lowForm.submit();

		}
	});
	$("#wizard_container").wizard({
		transitions: {
			branchtype: function ($step, action) {
				var branch = $step.find(":checked").val();
				if (!branch) {
					 $("form").valid();
				}
				return branch;
			}
		}
	});
	