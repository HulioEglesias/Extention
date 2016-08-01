$(document).ready(function() {
	var btnRed = $('.btn-danger').eq(3);
	var btnGreen = $('.btn-success').eq(4);
	var btnBlack = $('.btn-inverse');
	$('.form-group').eq(1).append('<div style="margin-top: 10px">АнтиТрейд калькулятор:').
	append('     <input type="text" placeholder="Наигрываемая сумма" class="extInputCalculator input-lg" style="background-color: #4d4d4f; color: #fff;padding: 2px 4px; border: 2px solid #4d4d4f; height: 34px; text-align: center;">').
	append('<div style="margin-top: 5px;">' + 
		'<button class="calculate-ext-calculate btn btn-default">Посчитать</button>' + 
		'<button class="calculate-ext-bet btn btn-default">Поставить</button>' + 
	'</div>').
	append('</div>');


	function Calculate(summ){
		var a = summ/4.28571429;
		a = Math.round(a);
		var b = summ/30;
		b = Math.ceil(b);
		return [a, b, a];
	}


	var array;

	$('.calculate-ext-calculate').on('click', function(){

		var summ = $('.input-lg').eq(1).val();
		console.log(summ);
		if(summ != "" && summ > 0){
			array = Calculate(summ);
			btnRed.html(array[0]);
			btnGreen.html(array[1]);
			btnBlack.html(array[2]);
		}
	});

	$('.calculate-ext-bet').on('click', function(){
		if(array == null || array == undefined){
			var summ = $('.input-lg').eq(1).val();
			if(summ != "" && summ > 0){
				array = Calculate(summ);
			}
			else{
				return;
			}
		}

		SetGreen(array[1]);
		setTimeout(function(){
			SetRedBlack(array[0]);
		}, 150);
		
	});

	function SetGreen(summ){
		$('#betAmount').val(summ);
		btnGreen.click();
		$('#betAmount').val('');
	}

	function SetRedBlack(summ){
		$('#betAmount').val(summ);
		btnRed.click();
		btnBlack.click();
		$('#betAmount').val('');
	}


});
//	$('.btn-danger').html('red');
//	$('.btn-success').html('green');
//	$('.btn-inverse').html('black');