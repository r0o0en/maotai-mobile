var height = 0;
//var loading = {
//  templ: '<div id="loading"><div class="loading_icon"></div></div>',
//  install: function () {
//      //alert(window.isLoadingStatu);
//      //console.log(window.isLoadingStatu);
//      if(window.isLoadingStatu) {
//          $('body').append(this.templ);
//          $('#pulldown').css({ opacity: 0 });
//          $('#pullup').css({ opacity: 0 });
//      }
//  },
//  destory: function () {
//      var loadBox = $('#loading');
//      if (loadBox) {
//          loadBox.remove();
//          $('#pulldown').css({ opacity: 1 });
//          $('#pullup').css({ opacity: 1 });
//      }
//  }
//};
var getUrlName = {
    ops: {
        name: 'cityCode',
        urls: 'grainCouponList.html'
    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return null;
    },
    getHref:function () {
        return this.ops.urls+'?cityCode='+this.getQueryString(this.ops.name);
    },
    getHrefService:function () {
        return 'servicerGrainCouponList.html?cityCode='+this.getQueryString(this.ops.name);
    }
};
var list = {
    pageIndex:0,
    init: function (opts) {
        var _this = this;
        this.wrapper = opts.wrapper;
		this.tpl=opts.tpl;
		this.liH=opts.liH;
		this.listContBox=opts.listContBox;
		this.pageSize=opts.pageSize || 20;
		this.url=opts.ajaxUrl;
		this.cityCode=opts.cityCode || '';
		//this.pageIndex=opts.pageIndex;
        //this.getList = opts.getList;//获取数据函数
		this.iscrollObj = iscrollAssist.newVerScrollForPull(_this.wrapper, _this.pulldownAction, _this.pullupAction);
		
		this.facilitatorCode = opts.facilitatorCode || '';//供应商代码
        this.merchantCode = opts.merchantCode || '';//商家代码
		this.addRequireData = opts.addRequireData || {};//其他额外参数
		
		this.events();
		return list;
	},
	events:function(){
		//var _this=this;
		this.setContHeight();
	},
    getList: function (ops) {
        var _this = this;
//      loading.install();
        $.ajax({
            url: _this.url,
            type: 'POST',
//          data: { pagerIndex: _this.pageIndex, cityCode: _this.cityCode,pageSize:_this.pageSize },//传到后台的一些参数 比如 pageIndex
            data: { pagerIndex: _this.pageIndex, cityCode: _this.cityCode,pageSize:_this.pageSize,facilitatorCode:_this.facilitatorCode,merchantCode:_this.merchantCode,addRequireData:_this.addRequireData},//传到后台的一些参数
            success: function (data) {
                //renderFn.call(_this, data);
//              loading.destory();
                _this.Render(data,ops);
                _this.iscrollObj.refresh();
            },
            error: function (a, b, c) {
                //console.log(a, b, c, '有错误！');
            }
        });
    },
    pulldownAction: function () {
        window.isLoadingStatu=false;
        // if (list.pageIndex == 0) {
		// 	new Modal({
		// 	     model:'popup',
		// 	     type:'warning',
		// 	     content:'已经是首页'
		// 	});
		// 	this.refresh();
		// 	return;
		// }
		// list.pageIndex--;
		// list.getList();
        //console.log(list.pageIndex);

        //2015-11-22 向下拉取数据时 直接渲染第一页的数据
		list.listContBox.html('');
        list.pageIndex = 0;
        var ops = 'first';//取第一页的新数据
        list.getList(ops);
	},
    pullupAction: function () {
        window.isLoadingStatu = false;
        //var _this = this;
        list.pageIndex++;
        list.getList();
        //console.log(list.pageIndex);
	},
//	setContHeight: function () {
//	    var _this = this;
//		var wh=$(window).height();
//		var hh = $('#header').height();
//		//console.log(hh);
//		var listWrapH = $('#list-wrap').height(wh - hh);
//		this.getList();
//	},
	setContHeight: function () {
	    //var _this = this;
		var wh=$(window).height();
		var hh = $('#header').height();
		var hh2 = $('.main-head').height();
		//console.log(hh);
//		var listWrapH = $('#list-wrap').height(wh - hh);
		if(hh2){
			$('#list-wrap').height(wh - hh - hh2);
		}else{
			$('#list-wrap').height(wh - hh);	
		}
		this.getList();
	},
	Render:function(datas,ops){
	    var _this = this;
	    //var jsondt = JSON.parse(datas);
	    var jsondt = datas;
	    jsondt.getUrl=getUrlName;
	    if(jsondt.flag == 2){
	    	new Modal({
				 model:'popup',
			     type:'warning',
			     content:'登录超时'
			});
			window.location.href="login.html"; 
	    }else{
	    	var str = _.template(this.tpl);
		    // if (ops && ops == "first") {
		        // new Modal({
		        //     model: 'popup',
		        //     type: 'warning',
		        //     content: '已经是首页'
		        // });
		        // _this.listContBox.html(str(jsondt));
		        // _this.iscrollObj.refresh();
		        // return;
		    // }
			console.log('当前页码：',_this.pageIndex,'当页条目：',jsondt.list.length,'每页最大条目：',_this.pageSize);
			if (jsondt.list.length == 0 && _this.pageIndex <= 0) {
			    _this.listContBox.html('<li class="nodata">暂无数据</li>');
			    $('#pullup').hide();
			    _this.iscrollObj.refresh();
				return;
			} else if (jsondt.list.length < _this.pageSize && _this.pageIndex >= 0) {
			    new Modal({
			        model: 'popup',
			        type: 'warning',
			        content: '没有更多数据'
			    });
			    _this.listContBox.append(str(jsondt));
			    _this.iscrollObj.refresh();
			    return;
			}
			_this.listContBox.append(str(jsondt));
			//console.log($('#listContBox').height());
			var boxHeight = this.listContBox.height();
			//var btnHeight = '51';
			//_this.iscrollObj.scrollTo(0, parseInt(-(boxHeight + btnHeight)));
			if(_this.pageIndex==0){
				height = boxHeight;
				_this.iscrollObj.scrollTo(0, 0);
			}else{
				_this.iscrollObj.scrollTo(0, parseInt(-(boxHeight-height)));
			}
			_this.iscrollObj.refresh();
	    }
	}
};

