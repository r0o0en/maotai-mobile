//var getUrlName =  function(name) {
//  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
//  var r = window.location.search.substr(1).match(reg);
//  if(r != null) return unescape(r[2]);
//	return null;
//};

var height = 0; /*list.Render() 全局记录模板容器上拉刷新后应该停留高度*/
//页面起始参数 
pageIndexDefaults = 1;
var list = {
	pageIndex: pageIndexDefaults,
	init: function(opts) {
		$.extend(this, {
			//			pageSize : 20,//每页数量
			limit: 10, //每页数量
			data: {}
		}, opts || {});
		//		$.each(opts, function(i,e) {
		//			console.log(i,' ------- ',e);
		//		});
		this.iscrollObj = iscrollAssist.newVerScrollForPull(this.wrapper, this.pulldownAction, this.pullupAction);
		this.setContHeight();
		return list;
	},
	setContHeight: function() { /*iscroll前置容器给高*/
		//		var wh=$(window).height();
		var wh = window.innerHeight;
		var hh = $('#header').height();
		var hh2 = $('.remove-height');
		hh2.each(function(i, e) {
			wh = wh - $(e).height();
		})
		$('#list-wrap').height(wh - hh);
		this.getList();
	},
	pulldownAction: function() {
		//向下拉取数据时 直接渲染第一页的数据
		list.listContBox.html('');
		list.pageIndex = pageIndexDefaults;
		list.getList();
	},
	pullupAction: function() {
		//向上拉取数据时 渲染下一页的数据
		list.pageIndex++;
		list.getList();
	},
	getList: function() { /*发送ajax请求获取列表数据*/
		var _this = this;
		ajax({
			url: _this.url,
			type: 'get',
			data: $.extend({
				page: _this.pageIndex
				//      		,pageSize: 10
				//      		,cityCode:getQueryString('cityCode')
			}, _this.data),
			success: function(data) {
				_this.Render(data);
			}
		});
	},
	Render: function(datas) { /* 根据success数据 渲染页面*/
		if(this.judgeTemplate()) {
			return false;
		}
		var _this = this,
			str = _.template(this.tpl),
			jsondt = typeof datas == 'object' ? datas : JSON.parse(datas);
		if(typeof jsondt.data == 'undefined' || typeof jsondt.data.length == 'undefined' || (jsondt.data.length == 0 && _this.pageIndex <= pageIndexDefaults)) {
			_this.listContBox.html('<li class="nodata text-cenner">暂无数据</li>');
			$('#pullup').hide();
			_this.iscrollObj.refresh();
			modal('暂无数据');
			return;
		} else if(jsondt.data.length < _this.limit && _this.pageIndex != pageIndexDefaults) {
			_this.listContBox.append(str(jsondt));
			setTimeout(function(){
				_this.iscrollObj.refresh();
				$('#pullup-label').text('最底部，没有更多数据了!');
				modal('最后一页，没有更多数据咯!');				
			},100);
			return false;
		}
		//更新列表数据
		_this.listContBox.append(str(jsondt));
		//更新偏移高度
		//		var boxHeight = this.listContBox.height();
		//		if(_this.pageIndex == pageIndexDefaults) {
		//			_this.iscrollObj.scrollTo(0, 0);
		//		} else {
		//			_this.iscrollObj.scrollTo(0, parseInt(-height));
		//		}
		//		height = boxHeight;
		//插件刷新
		setTimeout(function(){
			_this.iscrollObj.refresh();
			//modal('加载完成');
		},100);

	},
	judgeTemplate: function() { /*判断 underscore.js模板*/
		if(typeof _ == 'undefined' || !(_ instanceof Function)) {
			modal('underscore.js 未加载');
			this.judgeTemplate = function() {
				return true;
			};
			return true;
		} else if(this.tpl == undefined || typeof this.tpl != 'string') {
			modal('tpl模板未定义');
			return true;
		}
		return false;
	},
	reset: function(data) { //每次带指定参数搜索时，需要手动调用 清空html 重置 pageIndex,选择性附带新参数
		this.pageIndex = pageIndexDefaults;
		this.listContBox.html('');
		if(data) {
			$.extend(this.data, data);
		}
		this.getList();
	}
};