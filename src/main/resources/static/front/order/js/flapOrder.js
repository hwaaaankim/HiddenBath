	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		$('#submitBtn').attr('disabled', true);
		$('form#wrapped').attr('POST', '/order/flapOrderInsert');
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
				console.log(state.branchesActivated[2]);
				console.log(state.stepIndex);
				if(state.stepIndex === 13){
					$('#submitBtn').attr('disabled', false);
				}else{
					$('#submitBtn').attr('disabled', true);
				}
				if(state.stepIndex === 12){
					if($('input[name=model]:checked').attr('id')!=undefined){
						$('#flapModel').val('플랩장 모델 : ' + $('input[name=model]').attr('id'));
					}
					
					if($('input[name=color]:checked').attr('id')!=undefined){
						$('#flapColor').val('플랩장 색상 : ' + $('input[name=color]').attr('id'));
					}
					
					$('#flapWidth').val('가로길이 : ' + $('input[name=flapWidth]').val() + "[단위 : mm]");
					$('#flapHeight').val('세로길이 : ' + $('input[name=flapHeight]').val() + "[단위 : mm]");
					$('#flapDepth').val('깊이 : ' + $('input[name=flapDepth]').val() + "[단위 : mm]");
					
					
					if($('input[name=direction]:checked').attr('id')!=undefined){
						$('#flapDirection').val('도어 방향 : ' + $('input[name=direction]:checked').attr('id'));
					}else{
						$('#flapDirection').val('도어 방향 : 해당없음');
					}
					
					if($('input[name=led]:checked').attr('id')!=undefined){
						$('#flapLed').val('LED 추가여부 : ' + $('input[name=led]:checked').attr('id'));
					}else{
						$('#flapLed').val('LED 추가여부 : 해당없음');
					}
					
					if($('input[name=led_color]:checked').attr('id')!=undefined){
						$('#flapLedColor').val('LED 색상 : ' + $('input[name=led_color]:checked').attr('id'));
					}else{
						$('#flapLedColor').val('LED 색상 : 해당없음');
					}
					
					if($('input[name=option]:checked').attr('id')!=undefined){
						$('#flapOption').val('추가옵션[콘센트] : ' + $('input[name=option]:checked').attr('id'));
					}else{
						$('#flapOption').val('추가옵션[콘센트] : 해당없음');
					}
					
					if($('input[name=option_position]:checked').attr('id')!=undefined){
						$('#flapOptionPosition').val('추가옵션[콘센트] 위치 : ' + $('input[name=option_position]:checked').attr('id'));
					}else{
						$('#flapOptionPosition').val('추가옵션[콘센트] 위치 : 해당없음');
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
			
		var flapForm = $('<form></form>');
		// set attribute (form) 
		flapForm.attr("method", "post");
		flapForm.attr("action", "/order/flapOrderInsert");
		
		// create element & set attribute (input) 
		flapForm.append($('<input/>', {type: 'hidden', name: 'orderType', value: 'FLAP' })); // 주문 유형을 나타내는 필드
		flapForm.append($('<input/>', {type: 'hidden', name: 'model', value: $('#flapModel').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'color', value: $('#flapColor').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'width', value: $('#flapWidth').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'height', value: $('#flapHeight').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'depth', value: $('#flapDepth').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'flapDoorDirection', value: $('#flapDirection').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'led', value: $('#flapLed').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'ledColor', value: $('#flapLedColor').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'concent', value: $('#flapOption').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'concentPosition', value: $('#flapOptionPosition').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'name', value: $('#name').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'phone', value: $('#phone').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'email', value: $('#email').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'message', value: $('#message').val() }));
		flapForm.append($('<input/>', {type: 'hidden', name: 'subject', value: '플랩장 비규격주문' }));
		
		flapForm.appendTo('body');
		flapForm.submit();


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
	