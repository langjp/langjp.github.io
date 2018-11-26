if(navigator.userAgent.toLowerCase().indexOf('ipad') > -1 && $("link")[0] && $("link")[0].href.indexOf("main.css") > -1)
{
	$("link")[0].href="../main_new/main-mobile.css";
}
jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};
var encode = (function () {
	var encoding_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";// 64个

	var base64_encode = function(plain) {
		plain = String(plain);
		var cipher,i,len;
		var c1,c2,c3;
		i = 0;
		cipher="";
		len = plain.length;
		while (i<len) {
			c1 = plain.charCodeAt(i++) & 0xff;
			if (i == len) {
				cipher += encoding_table.charAt(c1>>2);
				cipher += encoding_table.charAt((c1&0x3) << 4);
				cipher += "==";
				break;
			}
			c2 = plain.charCodeAt(i++);
			if (i == len) {
				cipher += encoding_table.charAt(c1>>2);
				cipher += encoding_table.charAt(((c1&0x3) << 4)|((c2&0xF0)>>4));
				cipher += encoding_table.charAt((c2 & 0xF) << 2);
				break;
			}
			c3 = plain.charCodeAt(i++);
			cipher += encoding_table.charAt(c1 >> 2);
			cipher += encoding_table.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			cipher += encoding_table.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
			cipher += encoding_table.charAt(c3 & 0x3F);
		}
		return cipher;
	};
	
	return function (v) {
		return v;
	};
})();

/**
 * @description 提示接口修改。
 * @param {} msg
 */
function showMsg(msg) {
	var cookie = jQuery.cookie('ac_login_info');
		if (cookie == "sms") {//判断登陆状态
			js_alert("mode_sms", msg);
		} else {
			js_alert("mode_password", msg);
		}
}
(function ($) {
	var cookie = $.cookie('ac_login_info');
	function js_alert(divid, msg) {
		var msg_box = $("#"+divid + " .login_box_msg");
		if (msg == "") {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.hide();
			} else {
				msg_box.slideUp();
			}
			
		} else {
			if (/MQQBrowser/.test(navigator.userAgent)){
				msg_box.show();
			} else {
				msg_box.slideDown();
			}
			
		}
		msg_box.find("dd").html(msg);
		if (divid == "mode_sms") {
			$.cookie('ac_login_info', "sms");
		} else {
			$.cookie('ac_login_info', "passwork");
		}
	}
	
	window.js_alert = js_alert;
	// JavaScript Document
	$(document).ready(function(){
		login_operate();
		btn();
		$(":password").keypress(detectCapsLock);
	}); 
		
	//输入框
	function login_operate() { 
		var li = $(".login_operate ul li");
		var input = $(".login_operate ul li.password input");
		var li_hover = "li_hover";
		var li_press = "li_press";
		var phone_input = $(".phone input");
		var sms_input = $(".sms input");
		var username_input = $(".username input");
		var password_input = $(".password input");
		var password_input_new = $(".password_new input");
		var password_input_n = $(".password_n input");
		
		/*聚焦*/
		$(".focus").focus();
		/*选中*/
		$(input).click(function(){
			$(this).select();
		});
		
		//提示
		var inputs = $('.input');
		
		inputs.bind('focus',function(){
			$(this).siblings('label').css('opacity',$.trim(this.value)=='' ? 0.5 : 0);
		}).bind('keydown',function(){
			$(this).siblings('label').css('opacity',0);
		}).bind('blur',function(){
			$(this).siblings('label').css('opacity',$.trim(this.value)=='' ? 1 : 0);
		});
		setTimeout(function (){
			$.each(inputs, function (index, item){
				if ($.trim(this.value) !== ''){
					$(item).siblings('label').css('opacity',0);
				}
			});
		}, 800);
				
		if(!/(Mobile|Android|Windows Phone)/.test(navigator.userAgent))
		{
			/*悬停与聚焦后效果*/
			li.hover(function(){
				$(this).addClass(li_hover);
			  },function(){
				$(this).removeClass(li_hover);
			});
		}
		var mode_password, mode_sms;
		if (/IE/.test(navigator.userAgent) || /MQQBrowser/.test(navigator.userAgent)) {
			mode_password = function () {
				$("#mode_sms").hide();
				$("#mode_password").show();
				$(".username .focus").focus();
			}
			
			mode_sms = function () {
				$("#mode_password").hide();
				$("#mode_sms").show();
				$(".phone .focus").focus();
			} 
		} else {
		//切换
			mode_password = function () { 
				$("#mode_sms").fadeOut();
				$("#mode_password").fadeIn();
				$(".username .focus").focus(); 
			}
			
			mode_sms = function () {
				$("#mode_password").fadeOut(); 
				$("#mode_sms").fadeIn();
				$(".phone .focus").focus();		
			} 
		}
		window.mode_password = mode_password;
		window.mode_sms = mode_sms;
		$(".sms_go").hover(function(){
			$(this).removeClass(li_hover);
		  });
		
		$(phone_input).focus(function(){
			$(".phone").addClass(li_press);
			  });
		$(phone_input).blur(function(){
			$(".phone").removeClass(li_press);
			  });
			  
		$(sms_input).focus(function(){
			$(".sms").addClass(li_press);
			  });
		$(sms_input).blur(function(){
			$(".sms").removeClass(li_press);
			  });
			  
		$(username_input).focus(function(){
			$(".username").addClass(li_press);
			  });
		$(username_input).blur(function(){
			$(".username").removeClass(li_press);
			  });
			  
		$(password_input).focus(function(){
			$(".password").addClass(li_press);
			  });
		$(password_input).blur(function(){
			$(".password").removeClass(li_press);
			  });
			  
		$(password_input_new).focus(function(){
			$(".password_new").addClass(li_press);
			  });
		$(password_input_new).blur(function(){
			$(".password_new").removeClass(li_press);
			  });
			  
		$(password_input_n).focus(function(){
			$(".password_n").addClass(li_press);
			  });
		$(password_input_n).blur(function(){
			$(".password_n").removeClass(li_press);
			  });
			  	   
	};  
	
	
	//按钮
	function btn() { 
		var btn = $(".login_btn");
		$(btn).hover(function(){
			$(this).addClass("login_btn_hover");
		  },function(){
			$(this).removeClass("login_btn_hover");
		});
		$(btn).mousedown(function(){
			$(this).addClass("login_btn_press");
		});
		$(btn).mouseup( function (){
			$(this).removeClass("login_btn_press");
		});	
	}; 
	/*检测大写锁定*/
	function detectCapsLock(ae){
		var uO=ae.keyCode||ae.charCode,
			Uc=ae.shiftKey;			 
		if((uO>=65&&uO<=90&&!Uc)||(uO>=97&&uO<=122&&Uc))
			{
				js_alert("mode_password", "大写锁定已打开");
			}
			else if((uO>=97&&uO<=122&&!Uc)||(uO>=65&&uO<=90&&Uc))
			{
				js_alert("mode_password", "");
			}
			else
			{
				js_alert("mode_password", "");
			}
	};
})(jQuery);
