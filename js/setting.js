//获取我的详细信息 get
var url_getMyInfo = getAjaxOrigin() + '/api/myself/detailInfo';
//获取我的简单信息 get
var url_getSimpleInfo = getAjaxOrigin() + '/api/myself/simpleInfo';

//添加邀请人 post
var url_addMyInviter = getAjaxOrigin() + 'api/myself/addPidByMobile';

//退出登录
var url_logout = getAjaxOrigin() + '/api/userAddr/getAddrList';

//获取省城市区域列表			
var url_getArea = getAjaxOrigin() + "/api/area/getAreaList";

function getMyInfo(fun) {
	ajax({
		type: 'get',
		url: url_getMyInfo,
		success: function(data) {
			if(fun) {
				fun(data);
			}
		}
	})
}

function getSimpleInfo(fun) {
	ajax({
		type: 'get',
		url: url_getSimpleInfo,
		success: function(data) {
			if(fun) {
				fun(data);
			}
		}
	})
}

//退出登录
function logout(fun) {
	ajax({
		type: 'get',
		url: url_logout,
		success: function(data) {
			if(fun) {
				fun(data);
			}
			Cookies.set('token', '', {
				expires: 0
			});
			location.href = 'login.html';
		}
	})
}

function getProvince(fun) { //获取省份
	ajax({
		type: 'get',
		info: '获取省份',
		url: url_getArea,
		data: {
			pid: 1,
			level: 2
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getProvinceOption(parent, val) { //设置省
	getProvince(function(data) {
		var str = '<option value="">请选择省份</option>';
		if(val) {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '" ' + (e.id == val ? 'selected' : '') + '>' + e.areaName + '</option>'
			})
		} else {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '">' + e.areaName + '</option>'
			})
		}
		setOption(parent, str);
	});
}

function getXCity(pid, fun) { //获取城市
	ajax({
		type: 'get',
		info: '获取城市',
		url: url_getArea,
		data: {
			pid: pid,
			level: 3
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getCityOption(parent, pid, val) { //设置城市
	getXCity(pid, function(data) {
		var str = '<option value="">请选择城市</option>';
		if(val) {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '" ' + (e.id == val ? 'selected' : '') + '>' + e.areaName + '</option>'
			})
		} else {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '">' + e.areaName + '</option>'
			})
		}
		setOption(parent, str);
	});
}

function getArea(pid, fun) { //获取县区
	ajax({
		type: 'get',
		info: '获取县区',
		url: url_getArea,
		data: {
			pid: pid,
			level: 4
		},
		success: function(data) {
			if(fun && typeof fun == 'function') {
				fun(data.data, data);
			}
		}
	})
}

function getAreaOption(parent, pid, val) { //设置县区
	getArea(pid, function(data) {
		var str = '<option value="">请选择城市</option>';
		if(val) {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '" ' + (e.id == val ? 'selected' : '') + '>' + e.areaName + '</option>'
			})
		} else {
			$.each(data, function(i, e) {
				str += '<option value="' + e.id + '">' + e.areaName + '</option>'
			})
		}
		setOption(parent, str);
	});
}

function addAreaSelectEvent(val) { //添加三级联动事件
	var val = val || {};
	var pname = val.pname || 'province';
	var cname = val.cname || 'city';
	var aname = val.aname || 'area';
	//先移除 再 监听 省 select选择
	$('body').off('change', 'select.' + pname, provinceEvent)
	$('body').on('change', 'select.' + pname, provinceEvent)
	//先移除 再监听 市 select选择
	$('body').off('change', 'select.' + cname, cityEvent);
	$('body').on('change', 'select.' + cname, cityEvent);
}

function provinceEvent(e) { //省份联动
	var val = $(this).val();
	var c = $('select.city');
	var a = $('select.area');
	if(c.length > 0) {
		if(val) {
			getCityOption(c, val);
		} else {
			setOption(c, '<option value="">请选择市</option>');
		}
		setOption(a, '<option value="">请选择县/区</option>');
	}
}

function cityEvent(e) { //城市联动
	var val = $(this).val();
	var a = $('select.area');
	if(a.length > 0) {
		if(val) {
			getCityOption(a, val);
		} else {
			setOption(a, '<option value="">请选择区/县</option>');
		}
	}
}

function ProvinceSan(val) { //三级城市更新html,并设置默认值
	var val = val || {};
	var pname = val.pname || 'province';
	var cname = val.cname || 'city';
	var aname = val.aname || 'area';

	var p = $('select.' + pname);
	var c = $('select.' + cname);
	var a = $('select.' + aname);
	if(val.p) {
		getProvinceOption(p, val.p);
		if(val.c) {
			getCityOption(c, val.p, val.c);
			if(val.a) {
				getAreaOption(a, val.c, val.a);
			} else {
				a.html('<option value="">请选择区县</option>');
			}
		} else {
			c.html('<option value="">请选择城市</option>');
			a.html('<option value="">请选择区县</option>');
		}
	} else {
		getProvinceOption(p);
		c.html('<option value="">请选择城市</option>');
		a.html('<option value="">请选择区县</option>');
	}
};

function setOption(parent, str) {
	parent.html(str);
}

function judgeLoginStorageReferrer(fun) { //判断用户是否登录>获取信息>判断会员等级>在全局变量存储登录用户的账号作为url推荐人参数的值>执行回调
	if(Cookies.get('token')) {
		//获取用户信息
		getMyInfo(function(data) {
			if(!!data.data.rank) {
				referrer = data.data.mobile;
			} else {
				referrer = false;
			}
			if(typeof fun == 'function') {
				fun(data);
			}
		});
	} else {
		referrer = false;
		if(typeof fun == 'function') {
			fun();
		}
	}
}