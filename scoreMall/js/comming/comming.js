
(function ($) {
	function DataCenter() {
			
	}
	//NOTE: provide all the ajax interface here
	$.extend(DataCenter.prototype, {
        //获取url中的参数
		getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        //获取父级url的参数
        getFatherQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.parent.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        //判断是否为正整数
        isPositiveNum: function (s){
            var re = /^[0-9]*[1-9][0-9]*$/;
            return re.test(s);
        },
        //判断是否为正实
        isJdmoney: function(money){
            var t=/^\d+(\.\d+)?$/; 
            return t.test(money) 
        },
        //不含秒的格式化时间
        formatTime: function(value,m) {
            if (!value) {
                return '';
            }
            var date = new Date((value));
            var result = "";
            var munite = date.getMinutes()>10?date.getMinutes():'0'+date.getMinutes();
            if(m=="m"){
                result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +' '+ date.getHours() + ':' + munite;
            }else{
                result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); // +':'+second;
            }
            
            return result;
        },
        //获取签名
        getSign: function(){
            if (!window.WebViewJavascriptBridge) {
                return false;
            }
            window.WebViewJavascriptBridge.callHandler('getSign', {},
            function(responseData) {
                deviceData = responseData;
            });
            return deviceData;
        }
	});

	$.getComming = function () {
		return new DataCenter();
	};

})(jQuery);
