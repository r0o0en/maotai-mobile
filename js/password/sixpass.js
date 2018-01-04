function appendSixPass(fun) {
//	var styles = '<style type="text/css">.six-pass{position:fixed;top:0;left:0;right:0;bottom:0;-webkit-justify-content:center;justify-content:center;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center}.six-pass .pwd-box{width:280px;padding-left:1px;position:relative;border:1px solid #9f9fa0;border-radius:3px;over-flow:hidden}.six-pass .pwd-box input[type="tel"]{width:99%;height:45px;color:transparent;position:absolute;top:0;left:0;border:none;font-size:18px;opacity:0;z-index:1;letter-spacing:35px}.six-pass .fake-box input{width:16.5%;height:48px;border:none;border-right:1px solid #e5e5e5;text-align:center;font-size:30px}.six-pass .fake-box input:nth-last-child(1){border:none}</style>';
	var str = '<div class="six-pass">' +
				'<div class="six-pass-content"><a class="six-pass-close">x</a>' +
				'<header>请输入支付密码' +
				'</header>' +
				'<div class="pwd-box">' +
					'<input type="tel" maxlength="6" class="pwd-input" id="pwd-input">' +
					'<div class="fake-box">' +
						'<input type="password" readonly="">' +
						'<input type="password" readonly="">' +
						'<input type="password" readonly="">' +
						'<input type="password" readonly="">' +
						'<input type="password" readonly="">' +
						'<input type="password" readonly="">' +
					'</div>' +
				'</div>' +
				'</div>' +
			'</div>';
	
	var $wp = $(str);
//	$('head').after(styles);
	$('body').append($wp);
	var $numInput = $("#pwd-input");
	var $input = $(".fake-box input");
	var $close = $wp.find('.six-pass-close');
	$numInput.watch(function(_this,val) {
		var reg = /^[0-9]+/ig;
		var val_alert = reg.test(val) ? val.match(reg)[0] : '' ;
			val != val_alert ? _this.val(val_alert) : '';
		console.log(_this,val);
			callback(_this ,val_alert);
	});
	var o = {
		$wp:$wp,
		show:function () {
			$wp.addClass('active');
			$numInput.focus();
		},
		hide:function () {
			$wp.removeClass('active');
			this.resets();
		},
		remove:function(){
			$wp.remove();
		},
		val:function(){
			return $numInput.val();
		},
		resets:function(){
			$numInput.val('');
			$input.val('');
		}
	}
	$close.on('click',function(e){
		o.remove();
	})
	
	
	function callback(btn,val){
		var pwd = btn.val().trim();
		for(var i = 0, len = pwd.length; i < len; i++) {
			$input.eq("" + i + "").val(pwd[i]);
			console.log(pwd,i,pwd[i],$input.eq("" + i + ""));
		}
		$input.each(function() {
			var index = $(this).index();
			if(index >= len) {
				$(this).val("");
			}
		});
		if(len == 6) {
			//执行其他操作  
			if(fun){fun(o.val(),o)}
		}
	}
	return o;
}

