  (function ($) {
  $(window.document).ready(function () {
    function zkBackEvent(){
        history.back();
    }
//    WebViewJavascriptBridge.registerHandler("zkBackEvent", function(data, responseCallback) {
//        var responseData = "Javascript Says Right back aka!";
//        responseCallback(responseData);
//    });
    function getSignData() {
        if (!window.WebViewJavascriptBridge) {
            return false;
        }
        window.WebViewJavascriptBridge.callHandler('getSign', {},
            function(responseData) {
                deviceData = responseData;
            });
            return deviceData;
    }
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    }
    connectWebViewJavascriptBridge(function(bridge) {
        // 初始化
        bridge.init(function(message, responseCallback) {
            var data = {
                'Javascript Responds': 'backBefore'
            };
            responseCallback(data);
        });
        // oc调用js方法
        bridge.registerHandler('zkBackEvent',function(data, responseCallback) {
            history.back();
            var responseData = 'success';
            responseCallback(responseData);
        }); 
        bridge.registerHandler('readyBack',function(data, responseCallback) {
            readyBack();
            var responseData = {
                'Javascript Says': 'readBack!'
            };
            responseCallback(responseData);
        });
    });
    var dataCenter = $.getDataCenterIntance();//所有接口
    var comming = $.getComming();//公共方法
    var vm = new Vue({
        el:'#onlybuy',
        data:{
            todos: [],
            imags: [],
            name: '',
            describe: '',
            price: '',
            rmbPrice: '',
            cover: '',
            isExchangeable: '',
            normalFreight: '',
            specialFreignt: '',
            productType: '',
            productInfo: '',
            producter: ''  ,
            count: '',
            cashedCount: '',
            imgUrl: '../file/FileCenter!showImage2.zk?name=',
            endPrice: '',
            typePrice:'',
            id: comming.getQueryString('id'),
            s: '',
            typeName:'',
            value: 0,
            sign: null,
            adlist: []
        },
        methods:{
            //获取签名
            getSign: function(){
                var signCoo = $.cookie('sign') ? $.cookie('sign') : '';
//                var signCoo = 'OKveW0u2NSvwXsjetkD5cS1ds4tH68xEkwAE/YdXAo2DI9rBdBmopDIdXegfYd135CeKv16ZrYJTdlmc7uh71Q==';
                dataCenter.getSign({'sign':signCoo}, function(res){
                    if(res.STATUS){
                        vm.$data.sign = signCoo;
                        console.log('验证成功');
                    }else{
                        var getSign = setInterval(function(){
                            var signWord = getSignData();
                            if(signWord){
                                $.cookie('sign', signWord, { expires: 1, path: '/' });
                                dataCenter.getSign({'sign':signWord}, function(res){
                                    if(res.STATUS){
                                        console.log('验证成功');
                                        vm.$data.sign = signWord;
                                    }
                                })
                                clearInterval(getSign);
                            }
                        },100);
                    }
                })
                           
            }(),
            //视图渲染
            getShowGoods: function(){
                dataCenter.getShowOneInfo(comming.getQueryString('id'),function(res){
                    res = res.rows;
                    vm.$data.name = res.name;
                    vm.$data.describe = res.describe;
                    vm.$data.price = res.price;
                    vm.$data.rmbPrice = res.rmbPrice;
                    vm.$data.cover = vm.$data.imgUrl+res.cover;
                    vm.$data.isExchangeable = res.isExchangeable;
                    vm.$data.normalFreight = res.normalFreight;
                    vm.$data.specialFreignt = res.specialFreignt;
                    vm.$data.productType =  eval('(' + res.productType + ')');
                    $.each(vm.$data.productType, function(index,item){
                        vm.$data.todos.push(item);
                    })
                    vm.$data.adlist =  eval('(' + res.adList + ')');
                    $.each(vm.$data.adlist, function(index,item){
                        vm.$data.imags.push(vm.$data.imgUrl+item+'&style=40Q');
                    })
                    $.each(vm.$data.imags, function(index,item){
                        $('.swiper-wrapper').append('<div class="swiper-slide"><img src='+item+' alt=""></div>')
                    })
                    vm.$root.showSwiper();                 
                    vm.$data.productInfo = vm.$data.imgUrl+res.productInfo+'&style=30Q';
                    vm.$data.producter = res.producter;
                    vm.$data.count = res.count;
                    vm.$data.cashedCount = res.cashedCount;
                    $('.load').fadeOut(500);
                },function(err){console.log(err)})
            }(),
            // 轮播图
            showSwiper: function(){
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    slidesPerView: 1,
                    paginationClickable: true,
                    autoplay: 2500,
                    spaceBetween: 30,
                    loop: true
                    });
            },
            //类型选择事件
            typeOnly: function(img,price,name,e){
                var el = e.currentTarget;
                var detiale_text = $('.detiale-text');
                $(el).addClass('choose-ser-color').siblings().removeClass('choose-ser-color');
                $('#bannerType').attr('src',vm.$data.imgUrl+img);
                vm.$data.typePrice = price;
                vm.$data.s = parseInt($('#number').attr('data-value'));
                $('.coinPrice').text(price*vm.$data.s);
                vm.$data.endPrice = price*vm.$data.s;
                vm.$data.typeName = name;
                detiale_text.html('已选'+name+'，共<span class="chosenum">'+vm.$data.s+'</span>件');
            },
            //添加数量事件
            addNumber: function(){
                var oneprice = vm.$data.typePrice;
                if(oneprice){                    
                    vm.$data.s = parseInt($('#number').attr('data-value'));
                    vm.$data.s = vm.$data.s+1;
                    $('#number').attr('data-value',vm.$data.s);
                    $('#number,.chosenum').text(vm.$data.s);
                    $('.coinPrice,.coinPricesubmit').text(oneprice * 10000 * vm.$data.s / 10000);
                    vm.$data.endPrice = oneprice*vm.$data.s;
                }else{
                    $('.tip').show();
                    setTimeout(function(){
                        $('.tip').fadeOut(2000);
                    },1000);
                }
            },
            //减去数量事件
            subtractNumber: function(){
                var oneprice = vm.$data.typePrice;
                if(oneprice){                    
                    vm.$data.s = parseInt($('#number').attr('data-value'));
                    if(vm.$data.s <= 1){
                    $('#number').attr('data-value',1);
                    $('#number').text(1);
                    }else{                
                        vm.$data.s = vm.$data.s-1;
                        $('#number').attr('data-value',vm.$data.s);
                        $('#number,.chosenum').text(vm.$data.s);
                        $('.coinPrice,.coinPricesubmit').text(oneprice * 10000 * vm.$data.s / 10000);
                        vm.$data.endPrice = oneprice*vm.$data.s;
                    }   
                }else{
                    $('.tip').show();
                    setTimeout(function(){
                        $('.tip').fadeOut(2000);
                    },2000); 
                }
            },
            //确定按钮
            submitBtn: function(){
                for(var i=0;i<$('.choosecolor a').length;i++){
                    if($($('.choosecolor a')[i]).hasClass('choose-ser-color')){
                        $('.chuser').text($('.detiale-text').text());
                        $('.zhezhao').fadeOut(200);
                        $('#allBlur').removeClass('blur');
                        $('.dindan').css('bottom','-100%');
                        $('.coinPricesubmit').text(vm.$data.endPrice);
                        vm.$data.value = 1;
                        
                        $.cookie('name', vm.$data.name, { expires: 1, path: '/' });
                        
                        $.cookie('id', vm.$data.id, { expires: 1, path: '/' });
                        
                        $.cookie('producter', vm.$data.producter, { expires: 1, path: '/' });
                        
                        $.cookie('typeName', vm.$data.typeName, { expires: 1, path: '/' });
                        
                        $.cookie('bannerType', $('#bannerType').attr('src').split('name=')[1], { expires: 1, path: '/' });
                        
                        $.cookie('typePrice', vm.$data.typePrice, { expires: 1, path: '/' });

                        $.cookie('price', vm.$data.price, { expires: 1, path: '/' });
                        
                        $.cookie('num', vm.$data.s, { expires: 1, path: '/' });
                        return false;
                    }
                }
                $('.tip').show();
                    setTimeout(function(){
                        $('.tip').fadeOut(2000);
                },500);    
            },
            //立即兑换按钮事件
            nowExchange: function(){
                if(vm.$data.value == 1){
                    dataCenter.statisticalScore(vm.$data.sign,function(res){
                        if(res.STATUS){
                           /* var a = res.score?res.score:0;//总分
                            var b = res.usedScore?res.usedScore:0;//已使用
                            if((a-b)<vm.$data.endPrice){
                                alert('燃脂币不足!');
                                return false;
                            }else{                                      
                                window.location.href = 'regect.html';
                            }*/
                            window.location.href = 'regect.html';
                        }else{
                            alert(res.INFO);
                        }
                    },function(err){
                        console.log(err);
                    })
                }else{
                    alert('请选择颜色，尺寸或类型！');
                }
            }
        }
    });
  })
})(jQuery);
