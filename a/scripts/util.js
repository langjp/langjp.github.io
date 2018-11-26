if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}
function addClass(dom, cls){
	dom.className =  dom.className.trim() + " " + cls;
}
function removeClass(dom, cls){
	dom.className = dom.className.replace(new RegExp("\\b"+cls+"\\b", "g"), "");
}
//获取url参数
function getUrlParam(val){
	var reg = new RegExp("(^|\\?|&)"+ val +"=([^&#]*)(\\s|&|$|#)", "i");
	if (reg.test(location.href)) return unescape(RegExp.$2); 
	return "";
}
// Input动态背景，现已不用到
/*
function onWrapActive(dom, fieldName){
	addClass(dom, fieldName+"-active");
}
function onWrapBlur(dom, fieldName){
	removeClass(dom, fieldName+"-active");
}
*/
// 简写方法
function $(id){
	return document.getElementById(id);
}
// 添加收藏夹
function AddFavorite(title,url,desc){
	if ((typeof window.sidebar == 'object') && (typeof window.sidebar.addPanel == 'function')){
		window.sidebar.addPanel(title,url,desc);
	}else if (document.all && (typeof window.external.AddFavorite != 'undefined')){
		window.external.AddFavorite(url,title);
	}else
	{
		alert("添加到收藏夹失败，请使用Ctrl+D进行添加");
	}
}
// Ajax logout
var createXhrObject = (function(){
	var activeX = ['MSXML2.XMLHTTP.3.0',
	   'MSXML2.XMLHTTP',
	   'Microsoft.XMLHTTP'];
	return function(){
		var http;
		try {
			http = new XMLHttpRequest();                
		} catch(e) {
			for (var i = 0; i < activeX.length; ++i) {              
				try {
					http = new ActiveXObject(activeX[i]);                        
					break;
				} catch(e) {}
			}
		} finally {
			return http;
		}
	}
})();

function json_decode(str){
	var json = null;
	try{
		json = eval("(" + str + ')'); 
	}catch(e){}
	return json;
}

var logout = (function(){
	var conn = null;
	function processFinish(){
		var str = conn.responseText, 
			json= json_decode(str),
			msg = null,
			url, params, o, i;
		
		if(json){
			if(json.msg){
				msg = msg || json.msg;
			}
			if(json.success){
				url = json.url;
				if(json.params){
					o = json.params;
					params = [];
					for(i in o){
						if(o.hasOwnProperty(i)){
							params.push(i + "=" + encodeURIComponent(o[i]));
						}
					}
					url = url + (url.indexOf('?') === -1 ? '?' : '&') + params.join("&");
				}
				window.top.location.href = url;
			}else{
				msg = msg || "注销失败！";
			}
		}else{
			// request error
			msg = msg || "注销失败！";
		}
		if(msg){
			showMsg(msg);
			msg = null;
		}
	}
	return function(){
		if(!conn){
			conn = createXhrObject();
			conn.onreadystatechange = function(){
				if(conn.readyState == 4){
					processFinish();
					conn = null;
				}
			}
			conn.open("GET","/ajaxlogout?_t="+(new Date().getTime()),true);
			conn.send(null);
		}
	}
})();

function login(){
	window.top.location.href = "/webAuth/";
}
// 从get参数读取消息
function initMsg(silent){
	var searchStr = window.location.search;
	var result = searchStr.match(/authresult=([^&]*)/); // authresult=****
	var msg = null;
	if(result){
		msg = result[1];
		msg = msg.replace("%40","@");
		msg = decodeURIComponent(msg);
		if(!silent){
			showMsg(msg);
		}
	}
	return msg;
}
// 模拟alert提示...
var MSG = (function(){
	var doc = document,
		isIE = !!document.all,
		isStrict = doc.compatMode == "CSS1Compat",
		maskDom, divDom, titleDom, msgDom, closeDom,
		defaultTitle = "提示信息";
	function getViewHeight(){
		return isIE ? (isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
	        	   self.innerHeight;
	}
	function getViewWidth(){
		return isIE ? (isStrict ? doc.documentElement.clientWidth : doc.body.clientWidth) :
	        	   self.innerWidth;
	}
	function initDom(){
		var t;
		// mask
		if(!maskDom){
			t = maskDom = doc.createElement("div");
			t.className = "msg-mask";
			t.style.display = "none";
			t.style.width = "" + getViewWidth() + "px";
			t.style.height = "" + getViewHeight() + "px";
			doc.body.appendChild(t);
		}
		
		if(!divDom){
			divDom = doc.createElement("div");
			divDom.className = "msg-box";
			divDom.innerHTML = [
				'<div class="msg-title"><b>',defaultTitle,'</b></div>',
				'<div class="msg-content"></div>',
				'<p style="margin:0px" class="msg-close-two"><input class="msg-close buttons2" type="button" value="关闭" /></p>'].join("");
			doc.body.appendChild(divDom);

			titleDom = divDom.firstChild.firstChild;
			closeDom = divDom.childNodes[2];
			if(window.addEventListener){
				closeDom.addEventListener("click", pub.hide, false);
				document.addEventListener("keydown", onKeyDown, false);
			}else{
				closeDom.attachEvent("onclick", pub.hide);
				document.attachEvent("onkeydown", onKeyDown, false);
			}
			msgDom = divDom.childNodes[1];
		}
	}
	var navStr = navigator.userAgent.toLowerCase();
	var isSafari = !/chrome/.test(navStr) && /safari/.test(navStr);
	function onKeyDown(e){
		if(pub.hidden === false){
			e = e || window.event;
			var key = e.keyCode || e.charCode;
			// 如果按的是Enter或Esc
			if(key === 13 || isSafari && key === 3 || key === 27){
				pub.hide();
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				if (e.preventDefault) {
                	e.preventDefault();
				} else {
					e.returnValue = false;
				}
			}
		}
	}
	function syncSize(){
		if(!maskDom) return;
		var width = getViewWidth(),
			height = getViewHeight();
		maskDom.style.width = "" + width + "px";
		maskDom.style.height = "" + height + "px";
		var boxWidth = Math.max(divDom.offsetWidth, divDom.clientWidth),
			boxHeight = Math.max(divDom.offsetHeight, divDom.clientHeight);
		var x = Math.round((width - boxWidth) / 2),
			y = Math.round((height - boxHeight) / 2);
		divDom.style.left = "" + x + "px";
		divDom.style.top = "" + y + "px";
	}
	window.onresize = syncSize;
	var pub = {
		hidden : true,
		setTitle : function(title){
			initDom();
			titleDom.innerHTML = typeof title === "undefined" ? defaultTitle : title;
		},
		setContent : function(msg){
			initDom();
			msgDom.innerHTML = msg;
		},
		show : function(){
			initDom();
			pub.hidden = false;
			maskDom.style.display = "";
			divDom.style.display = "";
			syncSize();
		},
		hide : function(){
			pub.hidden = true;
			maskDom.style.display = "none";
			divDom.style.display = "none";
		},
		alert : function(msg, title){
			pub.setContent(msg);
			pub.setTitle(title);
			pub.show();
		}
	};
	return pub;
})();

if (typeof showMsg !== "function"){
	var showMsg = MSG.alert;
}
