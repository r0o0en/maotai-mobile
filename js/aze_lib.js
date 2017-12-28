
//项目名称
var workspace= 'maotai-mobile';

window.getAjaxOrigin = function(){//返回请求接口的 origin
	var fun;
	if(location.origin == "http://192.168.1.188"){
		fun = function(){ 
			return 'http://maotai.hmsh.com';
		//	return 'http://192.168.1.245:8085';//甘佳
		//	return 'http://192.168.1.124:8085';//雷超
		}
	}else if(location.origin == "http://hs1006.22ip.net:5555"){ 
		fun = function(){ return 'http://hs1006.22ip.net:2222';}
	}else{
		fun = function(){ return 'http://maotai.hmsh.com';}
	}
	return fun;
}();
function getOrigin() { //返回项目所在的 origin
	return location.origin;
}
function loginPage(){//跳转登录页
	parent.location.href = location.origin +'/'+workspace+ '/login.html';
}

/*
 刷新页面非登录页判断token  （注：每次ajax都需要判断）
* */
if (!Cookies.enabled) {
	alert('浏览器不支持cookies,请检查是否禁用！');
}
//cookies 参数
var cookiesOptions = {
	expires: 60*30
};
var isLoginPage = /(login|register|findPassword|index|integral|goodsDetails)\.html/ig.test(location.pathname);
//是否存在cookies
var isToken = Cookies.get('token');
judgeLoginType();

function judgeLoginType() { //每次刷新页面 或 ajax操作前执行方法
	if(!isLoginPage ){
		if(isToken){
			delayedToken();
		}else{
			toLoginPage();	
			return false;
		}
	}
	return true;
}
function delayedToken(){//延长token
	Cookies.set('token', isToken,cookiesOptions);
}
function toLoginPage() {//登录过期，2s自动跳转登录页/按钮立即跳转
	modal('登录过期！');
	Cookies.set('token','',{expires:0});
	setTimeout(function() {
		loginPage();
	}, 1000);
}
function loginSaveToken(data) {
	if(/login\.html/ig.test(location.href)){
		//登录页
		Cookies.set('token',data.data.token,cookiesOptions);
	}
}

/*如果是测试连接*/
var isTestLocalhost = location.origin == 'http://192.168.1.188';

(function (is) {
	if(is){
		isTestLocalhost = function (fun) {if(!fun){return false;}fun();};
	}else{
		isTestLocalhost = function () {return false;};
	};
})(isTestLocalhost);

isTestLocalhost(function () {
//	document.write("<script language=\"javascript\" src=\"http:\/\/192.168.1.188/hmsh-agent-web\/src\/main\/webapp\/mobile-new\/js\/vconsole.min.js\" > <\/script><script>var v = new VConsole();<\/script>");
	//	if( document.getElementById('flexRefreshBtn')){
	//		document.getElementById('flexRefreshBtn').style.display = 'block';		
	//	}
});

/* 一些公用的初始化 、hack*/
defineRem();
$(window).resize(function () {
	defineRem();
});
$(function () {
	if(browser.versions.ios||browser.versions.iPhone ||browser.versions.iPad){
		$('body').addClass('ios');
	}
	if(/SamsungBrowser/ig.test(navigator.userAgent)){
		$('body').addClass('samsung');
	}
});



//usertype
function userType (val) {
	if(val){
		localStorage.setItem('userType',val);
	}else{
		if(localStorage.hasOwnProperty('userType')){
			return localStorage.getItem('userType');	
		}else{
			return false;
		}
		
	}
}

//检测浏览器
window.browser = {
	versions: function() {
			var u = navigator.userAgent;
//			var	app = navigator.appVersion;
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
				weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
				qq: u.match(/\sQQ/i) == " qq" //是否QQ
			};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

$.popups = function (obj,btn) {
	/*
	 自定义弹窗
	 * */
	console.log(arguments);
	var popup = obj || $('.popups').not('.addEvent');
	typeof popup == 'string' ? popup = $(popup) : ''; 
	if(popup) {
		popup
			.children('.popup-wp').on('click', function(e) {
				$(this).parent('.popups').hide();
			})
			.children('.btn-popup-hide').on('click', function(e) {
				e.stopPropagation();
				$(this).parents('.popups').hide();
			})
			.siblings('.popup-body').on('click', function(e) {
				e.stopPropagation();
			});
		if(btn){
			console.log($(btn));
			$(btn).on('click',function(e){
				popup.toggle();
			})
		}
	}
	return popup;
};

function Popups(opt) {
	$.extend(this,{
		id:'',
		title:'',
		content:'',
		trigger:''
	},opt);
	this.trigger = $(this.trigger);
	this.popups = this.createhtml();
	$('body').append(this.popups);
	this.addEventListener();
}
Popups.prototype.createhtml = function (title,content) {
	return $('<section class="popups" id="'+this.id +'"></section>')
			.append('<div class="popup-wp">' +
						'<a class="btn-popup-hide" href="javascript:void(0)">×</a>' +
						'<div class="popup-body">' +
							'<header>' + this.title+ '</header>'+
							'<div class="popup-content">' + 
								this.content  +
				'</div></div></div>');
};
Popups.prototype.show = function () {
	this.popups.show();
	if(this.showCallback){
		this.showCallback(this.popups);
	}
};
Popups.prototype.hide = function () {
	this.popups.hide();
	if(this.hideCallback){
		this.hideCallback(this.popups);
	}
};
Popups.prototype.setContent = function (htmlstr) {
	if(!htmlstr){return false;}
	this.popups.find('poput-content').html(htmlstr);
};
Popups.prototype.setTitle = function (htmlstr) {
	if(!htmlstr){return false;}
	this.popups.find('popup-body').children('header').html(htmlstr);
};
Popups.prototype.addEventListener = function () {
	var _this = this ;
	_this.trigger.on('click',function () {
		_this.show();
	});
	_this.popups
		.children('.popup-wp').on('click', function(e) {
//			_this.popups.hide();
			_this.hide();
		})
		.children('.btn-popup-hide').on('click', function(e) {
			e.stopPropagation();
//			_this.popups.hide();
			_this.hide();
		})
		.siblings('.popup-body').on('click', function(e) {
			e.stopPropagation();
		});
};

//$.fn.popups = function (btn) {
//	/*
//	 自定义弹窗
//	 * */
//	if(this.length<1){return this;}
//	this.children('.popup-wp').children('.popup-content').on('click', function(e) {
//		e.stopPropagation();
//	});
//	return this.each(function (i,e) {
//		var _this = $(e) ;
//		_this.children('.popup-wp').on('click', function(e) {
//			_this.hide();
//		});
//		_this.find('.btn-popup-hide').on('click', function(event) {
//			event.stopPropagation();
//			_this.hide();
//		});
//		
//	});
//};


function returnNumbers(n) { /*首页 余额转换*/
				if(n && n != '0') {
					n = parseFloat(n).toFixed(2).split('.');
					var integer = n[0],
						decimal = n[1],
						str = '<small>￥</small><big>',
						str_integer = '',
						len = integer.length;
					/*整数拼接字符串*/
					while(len > 3) {
						str_integer = integer.substring(len - 3, len) + str_integer;
						integer = integer.substring(0, len - 3);
						len = integer.length;
						if(len > 0) {
							str_integer = ',' + str_integer;
							if(len <= 3) {
								str_integer = integer + str_integer;
								integer = undefined;
							}
						}
					}
					str += integer ? integer : str_integer;
					str += '</big><small>.' + decimal + '</small>';
					return str;
				} else {
					return '<small>￥</small><big>0</big><small>.00</small>';
				}
			};
$.fn.alterNumbers = function(n) { /*首页 余额转换*/
	if(n && n != '0') {
		n = parseFloat(n).toFixed(2).split('.');
		var integer = n[0],
			decimal = n[1],
			str = '<small>￥</small><big>',
			str_integer = '',
			len = integer.length;
		/*隐藏ico文字 */
//		if(len > (window.screen.width > 340 ? 7 : 6)) {
//			this.siblings('.ico').addClass('no-font');
//		}
		/*整数拼接字符串*/
		while(len > 3) {
			str_integer = integer.substring(len - 3, len) + str_integer;
			integer = integer.substring(0, len - 3);
			len = integer.length;
			if(len > 0) {
				str_integer = ',' + str_integer;
				if(len <= 3) {
					str_integer = integer + str_integer;
					integer = undefined;
				}
			}
		}
		str += integer ? integer : str_integer;
		str += '</big><small>.' + decimal + '</small>';
		this.html(str);
	} else {
		this.html('<small>￥</small><big>0</big><small>.00</small>');
	}
	return this;
};
$.fn.alterNumbersTwo = function(n) { /*首页 余额转换 不带￥符号，转万单位*/
	if(n && n != '0') {
		n = parseFloat(n).toFixed(2).split('.');
		var integer = n[0],
			decimal = n[1],
			str = '<big>',
			str_integer = '',
			len = integer.length;
		var cutlen = 5;
		if(len>=cutlen){
			decimal = integer.substring(len-(cutlen-1), len-(cutlen-3));
			integer = integer.substring(0, len-(cutlen-1));
			len = integer.length;
			while(len > 3) {
				str_integer = integer.substring(len - 3, len) + str_integer;
				integer = integer.substring(0, len - 3);
				len = integer.length;
				if(len > 0) {
					str_integer = ',' + str_integer;
					
					if(len <= 3) {
						console.log('<=3',integer,str_integer);
						str_integer = integer + str_integer;
						integer = undefined;
					}
				}
			}
			str += integer ? integer : str_integer;
			str += '</big><small>.' + decimal + '</small><big class="">万</big>';
		}else{
			/*整数拼接字符串*/
			while(len > 3) {
				str_integer = integer.substring(len - 3, len) + str_integer;
				integer = integer.substring(0, len - 3);
				len = integer.length;
				if(len > 0) {
					str_integer = ',' + str_integer;
					if(len <= 3) {
						str_integer = integer + str_integer;
						integer = undefined;
					}
				}
			}
			str += integer ? integer : str_integer;
			str += '</big><small>.' + decimal + '</small>';
		}
		this.html(str);
	} else {
		this.html('<big>0</big><small>.00</small>');
	}
	return this;
};


function defineRem(maxw) {
	/*
	  clientW >= maxW 时  1rem = 100px , 小于等于时 1rem = 100 * clientW/maxW;
	* */
	var maxW = maxw || 750,
		clientW = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
	document.documentElement.style.fontSize = 100 * (clientW >= maxW ? 1 : clientW / maxW) + 'px';
};
window.onLoad = function(fun) {
		var defaults = window.onload;
		window.onload = defaults ?
			function(e) {
				defaults(e);
				fun(e);
			} :
			fun;
};

function ajax(opt) {
	var ajaxinfotime = 1500 ;
	if(!!!opt){
		modal('ajax()没有参数',ajaxinfotime);
		return false;
	}
	if(typeof opt != 'object' || opt.length<1){
		modal('ajax()参数错误',ajaxinfotime);
		return false;
	}

	var o = $.extend({
			type:'post',
			dataType:'json',
			infosuccess:false,//显示提示
			errorCallback:false,//返回结果为 code!=200 code ==403 等结果也将执行回调函数 
		},opt),
		before = $.extend({}, opt);
	//非登录页每次操作判断?延长cookie有效期:跳转登录
	if(!judgeLoginType()){//token无效
		return false;
	}
	//token写入ajax头部
	var token = Cookies.get('token');
	if(!isLoginPage || token){
//		var token = Cookies.get('token');
		o.headers = $.extend({},{
			token: token
		},o.headers);
	}
	o.beforeSend = function(xhr, settings) {
		loading(settings.info||undefined);
		if(before.beforeSend instanceof Function){
			before.beforeSend(xhr,settings);
		}
	};
	o.success = function(data, status, xhr) {
//		if(typeof data == 'undefined' || data == undefined){
//			modal('获取数据异常',ajaxinfotime);
//			return false;
//		}
		if(typeof data.code == 'undefined'){
			modal('获取状态异常',ajaxinfotime);
			return false;
		}
		if(data.code != 200) {
			if(data.code == 403) {
				toLoginPage();
			} else {
				modal(data.msg ? '提示：'+ data.msg : '请求失败，稍后重试');
			}
			if(before.errorCallback && before.success instanceof Function ){
				before.success(data, status, xhr);
			}
			return false;
		}
		modalRemove();
		if(before.success instanceof Function){
			before.success(data, status, xhr);
			if(o.infosuccess){
				o.info ? modal(o.info +'成功',ajaxinfotime) :''; 
			}
		}else{
			if(o.infosuccess){
				modal(o.info? o.info +'成功':'请求成功',ajaxinfotime);
			}
		}
	};
	o.complete = function(xhr,status) {
		if (status == 'success'){ return false;}
		if(before.complete instanceof Function){
			before.complete(xhr,status);
		}else{
			modal(o.info? o.info +status : '请求：'+ status,ajaxinfotime);
		}
	};
	o.error = function(xhr,status,text) {
		if(before.error instanceof Function){
			before.error(xhr,status,text);
		}else{
			modal(o.info? o.info +status : '请求：'+ status,ajaxinfotime);
		}
	};
	
	return $.ajax(o);
}

function createSelect(data) {
	
	var o = $.extend({
		id: '',
		class: '',
		attrstring: '',
		list: [{
			value: -1,
			text: '全部'
		}],
		createLi: function(li) {
			return '<option value="' + li.dmId + '">' + li.name + '</option>';
		},
		callback: function(select) {}
	}, data);
	var str = '';
	$.each(o.list, function(i, e) {
		str += o.createLi(e);
	});
	if(typeof o.type == 'undefined'){
		var s = $('<select ' + o.attrstring + '></select>').addClass(o.class).attr('id', o.id);
		s.append(str);
		o.callback(s);
		return s;	
	}else if(o.type == 'option'){
		o.callback(str);
		return str;
	}else  if(o.type == 'select'){
		str = '<select ' + (o.attrstring ||'') +(o.class?' class="'+o.class+'"':'')+''+(o.id?' id="'+o.id+'"':'')+'>' + str;
		str +='</select>';
		o.callback(str);
		return str;
	}
}
//createSelect({
//	id: 'test',
//	calss: 'test2',
//	attrstring: 'name="test"',
//	list: [{
//		value: -1,
//		text: '全部'
//	}, {
//		value: 10,
//		text: '10KM'
//	}],
//	createLi: function(li) {
//		return '<option value="' + li.value + '">测试' + li.text + '</option>';
//	},
//	callback: function(select) {
//		$('#listContBox').append(select);
//	}
//});

/*
		 new Date(1511228236874).format('yyyy-MM-dd hh:mm:ss')
		 * */
	Date.prototype.format = function(style) {
			var o = {
				"M+" : this.getMonth() + 1, //month
				"d+" : this.getDate(),      //day
				"h+" : this.getHours(),     //hour
				"m+" : this.getMinutes(),   //minute
				"s+" : this.getSeconds(),   //second
				"w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
				"q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter
				"S"  : this.getMilliseconds() //millisecond
			};
			if (/(y+)/.test(style)) {
				style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for(var k in o){
				if (new RegExp("("+ k +")").test(style)){
					style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return style;
	};

function goBack(url){  
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE  
        if(history.length > 0){  
            window.history.go( -1 );  
        }else{  
        	if(url){
        		alert(1)
            	location.href = url;
            	return false;
            }
            window.opener=null;window.close();  
        }  
    }else{ //非IE浏览器  
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||  
            navigator.userAgent.indexOf('Opera') >= 0 ||  
            navigator.userAgent.indexOf('Safari') >= 0 ||  
            navigator.userAgent.indexOf('Chrome') >= 0 ||  
            navigator.userAgent.indexOf('WebKit') >= 0){  
  
            if(window.history.length > 1){  
                window.history.go( -1 );  
            }else{  
            	if(url){
            		alert(1)
            		location.href = url;
            		return false;
            	}
                window.opener=null;window.close();  
            }  
        }else{ //未知的浏览器  
            window.history.go( -1 );  
        }  
    }  
} 

function sha256(str) {
	if(!!!str){return false;}
	return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}
//获取imgurl
function getImgurl(str) {
	if(typeof str == 'string' && str.length > 0) {
		var reg = /http:[/]{2}[a-zA-Z0-9.%=/_\-]{1,}[.](jpg|jpeg|png)/ig;
		if(reg.test(str)) {
			return str.match(reg);
		} else {
			return false;
		}
	}
}
function getQueryData() { //获取参数
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			if(strs[i].length==0){continue;}
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
			
var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
          //1.首先动态创建一个容器标签元素，如DIV
          var temp = document.createElement ("div");
          //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
          (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
          //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
          var output = temp.innerHTML;
         temp = null;
         return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
         //1.首先动态创建一个容器标签元素，如DIV
         var temp = document.createElement("div");
         //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
         temp.innerHTML = text;
         //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
         var output = temp.innerText || temp.textContent;
      	temp = null;
      	return output;
    }
};

//判断 或设置 单选多选按钮
			$.fn.checked = function (val) {
				if(typeof val =='boolean'){
					return $(this).prop('checked',val);
				}else{
					return $(this).prop('checked');
				}
			};
function parseDate (time) {//解析后台传入的时间戳
	if(!time){
		return '';
	}else{
		return new Date(time*1000).format("yyyy-MM-dd hh:mm:ss");
	}
}

function restoreDate(time) {//将yyyy-mm-ss 解析为秒单位时间戳
	if(!time){
		return '';
	}else{
		var t = time.replace('-','/');
		return Date.parse(new Date(t))/1000;		
	}
}
function replacePage(e,page) {
	var e = e || window.event;  
	e.preventDefault();
	window.location.replace(page);
	return false;
}