//获取用户收货地址 get
var url_getAddress = getAjaxOrigin() + '/api/userAddr/getAddrList';

//新增/编辑用户收货地址  
var url_setAddress = getAjaxOrigin() + '/api/userAddr/saveOrMod';

//删除
var url_deleteAddress = getAjaxOrigin() + '';

//设置为收货地址  
var url_setIsDefault = getAjaxOrigin() + '/api/userAddr/setDefault';

//是否设置了支付密码
var url_getExistPayPass = getAjaxOrigin() + '/api/wallet/checkHasSecPwd';

//校验支付密码
var url_judgePayPass = getAjaxOrigin() + '/api/wallet/checkSecPwd';



function getAddress (fun) {
	ajax({
		type:'get',
		url:url_getAddress,
		success:function (data) {
			if(fun){fun(data);}
		}
	})
}

//function deleteAddress (id,fun) {//删除收货地址
//	ajax({
//		info:'删除收货地址',
//		infosuccess:true,
//		type:'get',
//		url:url_deleteAddress,
//		data:{
//			id:id
//		}
//		success:function (data) {
//			if(fun){fun(data);}
//		}
//	})
//}

function newAddressHtml() {
	//初始化弹框
	new Popups({
		title: '新增地址',
		content: returnAddressHtml(),
		trigger: '.new-address',
		hideCallback:function(wp){
			console.log(1);
			alertAddressForm();
		}
	});	
	//添加三级联动事件
	addAreaSelectEvent();
	//三级城市更新html,并设置默认值
	ProvinceSan()
}

function refreshAddressList() { //加载 刷新 收货地址列表   修改默认 新增 更改后 都将刷新
	getAddress(function(data){
		var str = _.template($('#tpl').html());
//		var str = _.template(returnAddressRow());
		$('#listContBox').empty().append(str(data));
		window.iSObj.refresh();
	});
}

//初始化弹窗
function returnAddressHtml(data) {
				var d = data || {};
				var str = '<form id="newAddressForm">' +
					'<input type="hidden" class="id"  value="" />' +
					'<p>收货人：</p>' +
					'<p><input type="text" class="realName" value="" /></p>' +
					'<p>手机号码：</p>' +
					'<p><input type="tel" class="mobile"  value="" /></p>' +
					'<p>省：</p>' +
					'<p><select class=" province" name="province"><option value="">请选择省</option></select></p>' +
					'<p>市：</p>' +
					'<p ><select class=" city" name="city"><option value="">请选择市</option></select></p>' +
					'<p>区：</p>' +
					'<p><select class=" area" name="area"><option value="">请选择县/区</option></select></p>' +
					'<p>详细地址：</p>' +
					'<p><input type="text" class="address" value="" /></p>' +
					'<p>是否默认：</p>' +
					'<p>' +
					'<input class="isDefault" type="checkbox" name="isDefault" id="isDefault-yes" value="1"/>' +
					'<label for="isDefault-yes">是否设为默认地址</label>' +
					'</p>' +
					'<p class="text-cenner">' +
					'<button class="btn btn-sm btn-red"  type="reset">重置</button>' +
					'<button class="btn btn-sm btn-green" onclick="newAddress(event,this)" >提交</button>' +
					'</p>' +
					'</form>';
				return str;
}

//新增收货地址
function newAddress(e,_this){
	e.preventDefault();
	var form = $('#newAddressForm');
	var id = form.find('.id');
	var name = form.find('.realName');
	var mobile = form.find('.mobile');
	var province = form.find('.province');
	var city = form.find('.city');
	var areas = form.find('.area');
	var address = form.find('.address');
	var isDefault = form.find('.isDefault');
	if(!name.inputjudgeName()|| !mobile.inputjudgeCellPhone()){
		return false;
	}
	if( province.val().length <=0 ||city.val().length<=0 || areas.val().length<=0 ){
		modal('请选择省市区');
		return false;
	}
	if(address.length<=0){
		modal('请输入详细地址');
		return false;
	}
	var d = {
			id:id.val()||'',
			realName: name.val(),
			mobile:mobile.val(),
			province:province.val(),
//			provinceName:province.children("option").filter(':checked').text(), 
			city:city.val(),
//			cityName:city.children("option").filter(':checked').text(), 
			area:areas.val(),
//			areaName:areas.children("option").filter(':checked').text(), 
			address:address.val(),
			isDefault: isDefault.checked() ? 1 :0,
	};
	if(typeof d.id =='undefined' || d.id.length<=0){
		console.log(1);
		delete d.id;
	}
	ajax({
		url:url_setAddress,
		data:d,
		success:function(){
			//隐藏弹框
			form.parents('.popup-wp').trigger('click');
//			var str = _.template(returnAddressRow());
//			$('#listContBox').empty().append(str(data));
			//重新获取，刷新列表
			refreshAddressList();
		}
	})
	
	return false;
};
function returnAddressRow() {//新增收货地址后在html中追加新的
					var str = '<%for(var i=0;i<data.length;i++){ %>'+
						'<% var item=data[i];console.log(item); %>'+
						'<table class="address-row <%= item.isDefault == 1?"active":""%> ">'+
							'<tr>'+
								'<th class="clearfix" colspan="2">'+
									'<span class="btn btn-orange fl-r" onclick=\'alertAddress(<%=JSON.stringify(item)%>)\'>修改</span>'+
									'<!--<span class="btn btn-blue fl-r isDefault-yes ">取消默认</span>-->	'+
									'<span class="btn btn-green fl-r is-default" onclick="isDefault(event,this,<%=item.id%>)">设为默认</span>'+	
									'<span class="btn btn-red fl-r">删除地址</span>'+
								'</th>'+
							'</tr>'+
							'<tr>'+
								'<td>收货人：</td>'+
								'<td><%=item.realName%></td>'+
							'</tr>'+
							'<tr>'+
								'<td>手机号码：</td>'+
								'<td><%=item.mobile %></td>'+
							'</tr>'+
							'<tr>'+
								'<td>省市区：</td>'+
								'<td><%=item.provinceName%>-<%=item.cityName%>-<%=item.areaName%></td>'+
							'</tr>'+
							'<tr>'+
								'<td>详细地址：</td>'+
								'<td><%=item.address%></td>'+
							'</tr>'+
						'</table>'+
			
						'<%}%>';
					return str;
}


//设置为默认收货地址  
function isDefault(e,btn,id,fun){   
	if(!id){return false;}
	console.log(btn);
	ajax({
		info:"设置默认地址",
		infosuccess:true,
		url:url_setIsDefault,
		data:{
			id:id
		},
		success:function (data) {
			if(fun){fun(data);}
			//重新获取，刷新列表
			refreshAddressList();
		}
	})
}
//修改  收货地址
function alertAddress(data) {
	alertAddressForm(data);
	$('.popups').show();
}

//根据传入参数更改新增地址表单 value （注意不是$.val()）
function alertAddressForm(data) {
	var d = data||{};
	var form = $('#newAddressForm');
	if(form.length<=0){return false;}
	var id = form.find('.id');
	var name = form.find('.realName');
	var mobile = form.find('.mobile');
	var province = form.find('.province');
	var city = form.find('.city');
	var areas = form.find('.area');
	var address = form.find('.address');
	var isDefault = form.find('.isDefault');
	id.attr('value',d.id||'');
	name.attr('value',d.realname||'');
	mobile.attr('value',d.mobile||'');
	address.attr('value',d.address||'');
	console.log(2,{
		p:d.province,
		c:d.city,
		a:d.area
	});
	//更新城市选择
	ProvinceSan({
		p:d.province,
		c:d.city,
		a:d.area
	});
	if(d.isDefault==1){
		isDefault.checked(true).attr('checked','checked');
	}else{
		isDefault.removeAttr('checked');		
	}
	form[0].reset();
}


function goPayment (orderId) {//前往收银台
	location.href = 'payment.html?orderId=' + orderId;
}

function judgePayPass(pwd,fun) {//校验支付密码
	if(!pwd){
		modal('没有支付密码');
		return false;
	}
	ajax({
		type:'get',
		url:url_judgePayPass,
		data:{
			pwd:sha256(pwd)
		},
		success:function (data) {
			if(fun){fun(data);}
		}
	})
}

function getExistPayPass(fun,url) {//检查是否设置了支付密码
	ajax({
		type:'get',
		errorCallback:true,
		url:url_getExistPayPass,
		success:function (data) {
			if(data.code == 4042){
				if(confirm(data.msg)){
					location.href = 'payPassword.html' + (url? url:'');
				}
			}else{
				if(fun){fun(data);}
			}
		}
	})
}