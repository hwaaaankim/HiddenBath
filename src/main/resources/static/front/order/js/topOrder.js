	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		$('#submitBtn').attr('disabled', true);
		$('form#wrapped').attr('POST', '/order/topOrderInsert');
		$("#wizard_container").wizard({
			stepsWrapper: "#wrapped",
			submit: ".submit",
			beforeSelect: function (event, state) {
				if ($('input#website').val().length != 0) {
					return false;
				}
				if (!state.isMovingForward)
					return true;
				var inputs = $(this).wizard('state').step.find(':input');
				return !inputs.length || !!inputs.valid();
			},
			afterSelect:function(event, state){
				if(state.stepIndex === 10){
					$('#submitBtn').attr('disabled', false);
				}else{
					$('#submitBtn').attr('disabled', true);
				}
				if(state.stepIndex === 9){
					if($('input[name=model]:checked').attr('id')!=undefined){
						$('#topModel').val('상부장 모델 : ' + $('input[name=model]').attr('id'));
					}
					
					if($('input[name=color]:checked').attr('id')!=undefined){
						$('#topColor').val('상부장 색상 : ' + $('input[name=color]').attr('id'));
					}
					
					$('#topWidth').val('가로길이 : ' + $('input[id=topWidth]').val() + "[단위 : mm]");
					$('#topHeight').val('세로길이 : ' + $('input[id=topHeight]').val() + "[단위 : mm]");
					$('#topDepth').val('깊이 : ' + $('input[id=topDepth]').val() + "[단위 : mm]");
					
					if($('input[name=door]:checked').attr('id')!=undefined){
						$('#topDoor').val('도어 수량 : ' + $('input[name=door]:checked').attr('id'));
					}else{
						$('#topDoor').val('도어 수량 : 해당없음');
					}
					
					if($('input[name=door_direction]:checked').attr('id')!=undefined){
						$('#topDoorDirection').val('도어 방향 : ' + $('input[name=door_direction]:checked').attr('id'));
					}else{
						$('#topDoorDirection').val('도어 방향 : 해당없음');
					}
					
					if($('input[name=led]:checked').attr('id')!=undefined){
						$('#topLed').val('LED 추가여부 : ' + $('input[name=led]:checked').attr('id'));
					}else{
						$('#topLed').val('LED 추가여부 : 해당없음');
					}
					
					if($('input[name=led_color]:checked').attr('id')!=undefined){
						$('#topLedColor').val('LED 색상 : ' + $('input[name=led_color]:checked').attr('id'));
					}else{
						$('#topLedColor').val('LED 색상 : 해당없음');
					}
					
					if($('input[name=option]:checked').attr('id')!=undefined){
						$('#topOption').val('추가옵션[콘센트] : ' + $('input[name=option]:checked').attr('id'));
					}else{
						$('#topOption').val('추가옵션[콘센트] : 해당없음');
					}
					
					if($('input[name=option_position]:checked').attr('id')!=undefined){
						$('#topOptionPosition').val('추가옵션[콘센트] 위치 : ' + $('input[name=option_position]:checked').attr('id'));
					}else{
						$('#topOptionPosition').val('추가옵션[콘센트] 위치 : 해당없음');
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
			
		
		var topForm = $('<form></form>');
			// set attribute (form) 
			topForm.attr("method", "post");
			topForm.attr("action", "/order/topOrderInsert");
			
			// create element & set attribute (input) 
			topForm.append($('<input/>', {type: 'hidden', name: 'orderType', value: 'TOP' })); // 주문 유형을 나타내는 필드
			topForm.append($('<input/>', {type: 'hidden', name: 'model', value: $('#topModel').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'color', value: $('#topColor').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'width', value: $('#topWidth').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'height', value: $('#topHeight').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'depth', value: $('#topDepth').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'led', value: $('#topLed').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'ledColor', value: $('#topLedColor').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'concent', value: $('#topOption').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'concentPosition', value: $('#topOptionPosition').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'topDoor', value: $('#topDoor').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'topDoorDirection', value: $('#topDoorDirection').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'name', value: $('#name').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'phone', value: $('#phone').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'email', value: $('#email').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'message', value: $('#message').val() }));
			topForm.append($('<input/>', {type: 'hidden', name: 'subject', value: '상부장 비규격주문' }));
			
			topForm.appendTo('body');
			topForm.submit();
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
	