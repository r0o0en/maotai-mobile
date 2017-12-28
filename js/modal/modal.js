function Modal(options) {
	$.extend(this, {
		title: "",
		model: "dialog",
		time: 3000,
		type: "info",
		content: "努力加载中...",
		cancelText: "取消",
		okText: "确定",
		cancel: false,
		ok: false,
		auto: true,
		src: "",
		close: false,
		init: function() {}
	}, options || {});
	this.initialize();
}
Modal.prototype = {
	initialize: function() {
		
		var that = this,
			dialog;
		if(this.model == "dialog" || this.model == "loading" || this.model == "upload") {
			dialog = '<div class="modal">' + '  <div class="modal-dialog">' + "    {title}" + '    <div class="modal-bd">' + "      {content}" + "    </div>" + '    <div class="modal-footer">{cancel}{ok}</div>' + "  </div>" + "</div>";
			if(this.model == "loading" || this.model == "upload") {
				this.ok = false;
				this.cancel = false;
				this.content = '<div class="modal-loading ' + (this.model == "upload" ? "upload" : "") + '"></div><p>' + this.content + "</p>";
			}
			dialog = dialog.replace("{title}", this.title ? '<div class="modal-hd">' + this.title + "</div>" : "").replace("{content}", this.content).replace("{cancel}", this.cancel ? '<div class="modal-btn" data-btn="cancel"><span class="cancelBtn">' + this.cancelText + "</span></div>" : "").replace("{ok}", this.ok ? '<div class="modal-btn" data-btn="ok"><span class="okBtn">' + this.okText + "</span></div>" : "");
		} else {
			if(this.model == "popup") {
				dialog = '<div style="top:' + (window.innerHeight / 2 - 16) + 'px" class="modal modal-popup">' + '  <div class="popup popup-' + this.type + '">' + this.content + "</div>" + "</div>";
			} else {
				if(this.model == "img") {
					dialog = '<div class="modal modal-img modal-active"><img src="' + this.src + '" /></div>';
				} else {
					return;
				}
			}
		}
		this.dialog = $(dialog);
		this.auto && this.show();
		this.init();
		this.events();
		//console.log(this);
	},
	show: function() {
		var that = this;
		$(document.body).append(this.dialog);
		setTimeout(function() {
			that.dialog.addClass("modal-active");
		}, 10);
		if(this.model == "popup" && typeof this.time == 'number' && this.time >= 0) {
			window.modalTimeOut = setTimeout(function() {
				that.remove();
				window.modalTimeOut = undefined;
			}, this.time);
		}
	},
	setContent: function(val) {
		this.dialog.find(".modal-bd").html(val);
	},
	remove: function() {
		var that = this;
		this.dialog.removeClass("modal-active");
		try {
			that.close && that.close();
			that.dialog.remove();
		} catch(e) {};
	},
	events: function() {
		var that = this;
		this.dialog.delegate(".modal-btn", "click", function() {
			switch($(this).data("btn")) {
				case "cancel":
					if(typeof that.cancel == "function" && that.cancel() !== false) {
						that.remove();
					}
					break;
				case "ok":
					if(typeof that.ok == "function" && that.ok() !== false) {
						that.remove();
					}
					break;
			}
		});
		if(this.model == "img") {
			this.dialog.on("click", function() {
				that.remove();
			});
		}
	}
};
function modalTimeOutRemove() {
 	clearTimeout(window.modalTimeOut);
 	window.modalTimeOut = undefined;
};
function modalRemove() {
 	$('.modal').remove();
 	modalTimeOutRemove();
};
function modal(info, time) {
	/*
		model : ['popup','loading','upload']
		popup > type : ['info','warning','dialog']
	 * */
	modalRemove();
	if(typeof info == 'object'){
		return new Modal($.extend({
			model: 'popup',
			type: 'warning',
			content:'no text',
			time: 3000
		},info));	
	}
	return new Modal({
		model: 'popup',
		type: 'warning',
		content: info || 'no text',
		time: time || 3000
	});
}

function loading(info) {
	modalRemove();
	if(info){
		return new Modal({
			model: 'loading',
			content: info + '...'
		});	
	}
	return new Modal({
		model: 'loading'
	});
//	return new Modal({
//		model: 'popup',
//		type: 'warning',
//		content: '<div class="modal-loading" style="margin:10px auto 	;display:block;"></div>'+(text?text +'...':'努力加载中...')+'<br/>',
//		time: -1
//	});
}