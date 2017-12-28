//添加到购物车 token goodsId quantity
var url_addCart = getAjaxOrigin() + '/api/cart/addToCart';
//移除购物车 token   goodsIdJsonArrays  商品ID的JSON列表,需要中括号[1,2,3]
var url_removeCart = getAjaxOrigin() + '/api/cart/delFromCart';
//购物车列表 token page
var url_getCartList = getAjaxOrigin() + '/api/cart/cartList';
//修改购物车数量 token id quantity
var url_setCartQuantity = getAjaxOrigin() + '/api/cart/modCartNum';

//计算订单
var url_orderSettlement = getAjaxOrigin() + '/api/order/calculateOrder';

//校验支付密码
var url_judgePayPass = getAjaxOrigin() + '/api/wallet/checkSecPwd';

function settlementOrder(d, fun) {
	ajax({
		info: '计算订单',
		infosuccess: false,
		headers: {
			'Content-Type': 'application/json'
		},
		url: url_orderSettlement,
		data: typeof d == "string" ? d : JSON.stringify(d),
		success: function(data) {
			var datas = data.data;
			if(d.buyType == 1) { //积分
				if(datas.totalPoint < datas.canDeductPoint) {
					modal('积分不足：'+datas.totalPoint);
					return false;
				}
			}
			if(fun) {
				fun(data)
			}
		}
	})
}

//将商品添加入购物车
function addCart(id, num, fun) {
	if(event) {
		event.preventDefault();
		event.stopPropagation();
	}
	ajax({
		url: url_addCart,
		info: '加入购物车',
		infosuccess: true,
		data: {
			goodsId: id,
			quantity: num || 1
		},
		success: function(data) {
			if(fun) {
				fun(data)
			}
		}
	})
}
//将商品移出购物车
function removeCart(arr, fun) { //goodsIdJsonArrays  商品ID的JSON列表,需要中括号[1,2,3]
	ajax({
		info: "移出购物车",
		infosuccess: true,
		url: url_removeCart,
		data: {
			goodsIdJsonArrays: arr,
		},
		success: function(data) {
			if(fun) {
				fun(data)
			}
		}
	})
}
//修改购物车数量
function alertCartNumber(id, num, fun) {
	ajax({
		info: "修改商品数量",
		infosuccess: true,
		url: url_setCartQuantity,
		data: {
			goodsId: id,
			quantity: num || 1
		},
		success: function(data) {
			if(fun) {
				fun(data)
			}
		}
	})
}

//购物车列表
function getCartList(pagei, fun) {
	ajax({
		type: 'get',
		url: url_getCartList,
		data: {
			page: pagei || 1,
		},
		success: function(data) {
			if(fun) {
				fun(data)
			}
		}
	})
}

function judgePayPass(pass, fun) { //检校支付密码
	ajax({
		type: 'get',
		url: url_judgePayPass,
		data: {
			pwd: pwd,
		},
		success: function(data) {
			if(data.code == 4042) {

			}
			if(fun) {
				fun(data)
			}
		}
	})

}