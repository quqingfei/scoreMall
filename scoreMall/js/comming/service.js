(function ($) {
	function DataCenter() {
		this._ajax = function (type, subUrl, data, success, error, context) {
			var _options = {
				type: type,
				url: subUrl,
				dataType: 'json',
				success: success,
				error: error,
				data: data
			};

			if(_options.type.toUpperCase() == "GET") {
				_options.url += ((_options.url.indexOf("?") > -1 ? "" : "?") + "&_t=" + (new Date).getTime());
			}

			if(context) {
				_options.context =  context;
			}

      		return $.ajax(_options);
		};

		this._get = function (url, data, success, error, context) {
			return this._ajax("GET", url, data, success, error, context);
		};

		this._post = function (url, data, success, error, context) {
			return this._ajax("POST", url, data, success, error, context);	
		};

		this._put = function(url, data, success, error, context) {
			var defaults = { _method: "put" };
			defaults = $.extend(defaults, data);
			return this._post(url, defaults, success, error, context);
		};

		this._delete = function(url, data, success, error, context) {
			var defaults = { _method: "delete" };
			defaults = $.extend(defaults, data);
			return this._post(url, defaults, success, error, context);
		};		
	}

	//NOTE: provide all the ajax interface here
	$.extend(DataCenter.prototype, {
        //检测签名
		getSign: function (sign,success, error, context) {
            var url = "../fatburn/ScoreAction!checkSign.zk";
			return this._post(url,sign, success, error, context);
		},
		//获取商品列表
        getShowGoods: function (success, error, context) {
            var url = "../fatburn/ScoreMallAction!showGoods.zk"
			return this._get(url, {}, success, error, context);
		},
		//单个商品展示
		getShowOneInfo: function (id, success, error, context) {
			var url = "../fatburn/ScoreMallAction!showOne.zk?id="+id;
			return this._get(url, {}, success, error, context);
		},
		//获取用户信息
		getUserInfo: function (success, error, context) {
			var url = "../fatburn/ScoreMallAction!getUser.zk";
			return this._get(url, {}, success, error, context);
		},
		//已兑换记录信息
		alExchange: function (index, success, error, context) {
			var url = "../fatburn/ScoreMallAction!showOrders.zk?pageSize=10&pageIndex="+index+"&orderByDesc=gmtCreate";
			return this._get(url, {}, success, error, context);
		},
        //单个已兑换记录详情
		oneExchange: function (id, success, error, context) {
			var url = "../fatburn/ScoreMallAction!getById.zk?id="+id;
			return this._get(url, {}, success, error, context);
		},
		//积分记录
		sourceRecord: function (index, success, error, context) {
			var url = "../fatburn/ScoreMallAction!showNotes.zk?pageSize=30&pageIndex="+index;
			return this._get(url, {}, success, error, context);
		},
		//获取用户收货地址
		getUserAddress: function (success, error, context) {
			var url = "../fatburn/ScoreMallAction!getAddress.zk";
			return this._get(url, {}, success, error, context);
		},
		//设置默认地址
		setUserAddress: function (id, success, error, context) {
			var url = "../fatburn/ScoreMallAction!setDefaultAddress.zk?id="+id;
			return this._get(url, {}, success, error, context);
		},
		//订单完成
		orderComplete: function (data, success, error, context) {
			var url = "../fatburn/ScoreMallAction!addOrder.zk";
			return this._post(url, data, success, error, context);
		},
		//获取订单确定信息
		orderSubmitInfo: function (id, success, error, context) {
			var url = "../fatburn/ScoreMallAction!getById.zk?id="+id;
			return this._post(url, {}, success, error, context);
		},
        //积分统计
        statisticalScore: function (sign, success, error, context) {
			var url = "../fatburn/ScoreAction!statisticalScore.zk";
			return this._post(url, sign, success, error, context);
		},
        //提交订单
        buyScoreGood: function(data, success, error, context){
            var url = "../fatburn/ScoreMallAction!buyScoreGood.zk";
			return this._post(url, data, success, error, context);
        }
	});

	$.getDataCenterIntance = function () {
		return new DataCenter();
	};

})(jQuery);
