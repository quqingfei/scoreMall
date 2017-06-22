$(function(){  
        
    $(window).resize(function () { 
        htmlfont();
        $('.storetit').css('width',($(window).width()-16-$('.storeimg').width())+'px');
    })
    function htmlfont(){
        var sw = $(window).width();
                    if(sw>640){
                        sw = 640;
                    }
        $("html").css("font-size",sw/1080*32.8125+"px");
        $('.storetit').css('width',($(window).width()-16-$('.storeimg').width())+'px');
    }
    htmlfont();
    $('.noinfation').css({'lineHeight':$(window).height()+'px','height':$(window).height()+'px'})
    function zkBackEvent(){
       
    }
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
    var index = 1;
    var dataCenter = $.getDataCenterIntance();//所有接口
    var comming = $.getComming();//公共方法
    var vm = new Vue({
        el:'#list',
        data:{
            todos:[],
            imgUrl: '../file/FileCenter!showImage2.zk?name=',
            img:'',
            id:'',
            name:'',
            type:'',
            imgage:'',
            dikou:'',
            truemoney:'',
            count:''
        },
        methods:{
            getSign: function(){
                var signCoo = $.cookie('sign') ? $.cookie('sign') : '';
//                var signCoo = 'OKveW0u2NSvwXsjetkD5cfC9ap5bZkxwOfz6UuwM3cKDI9rBdBmopDIdXegfYd135CeKv16ZrYJTdlmc7uh71Q==';
                dataCenter.getSign({'sign':signCoo}, function(res){
                    if(res.STATUS){          
                       
                    }else{
                        var getSign = setInterval(function(){
                            var signWord = getSignData();
                            if(signWord){
                                $.cookie('sign', signWord, { expires: 1, path: '/' });
                                dataCenter.getSign({'sign':signWord}, function(res){
                                    if(res.STATUS){
                                                                           
                                    }
                                })
                                clearInterval(getSign);
                            }
                        },100);
                    }
                })
                setTimeout(function(){
                    $('#yiweima').attr("src","../fatburn/ScoreMallAction!getCodeImage.zk?code="+comming.getQueryString('id'))
                    vm.$root.getListGoods();
                },10);
//                setTimeout(function(){
//                    $('.load').fadeOut(500);
//                },3000);         
            }(),
             getListGoods: function(){
              dataCenter.oneExchange(comming.getQueryString('id').toString(),function(res){
                  vm.$data.name = res.scoreMallOrder.name;
                  vm.$data.type = res.scoreMallOrder.type;
                  vm.$data.imgage = vm.$data.imgUrl + res.scoreMallOrder.cover;
                  vm.$data.dikou = res.scoreMallOrder.price/100;
                  vm.$data.truemoney = res.scoreMallOrder.cashPrice;
                  vm.$data.count = res.scoreMallOrder.count;
              })
            },
            isAddScroll: function(){
                $(window).scroll(function(){
                     if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        index+=1;
                        vm.$root.getListGoods(index);
                     }
                 });
            }
        }
    })
})