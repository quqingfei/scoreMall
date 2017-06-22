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
    function htmlfont(){
        var sw = $(window).width();
                    if(sw>640){
                        sw = 640;
                    }
        $("html").css("font-size",sw/1080*32.8125+"px");
    }
    htmlfont();
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
        el:'#table',
        data:{
            todos:[],
            iter:0
        },
        methods:{
            getSign: function(){
                var signCoo = $.cookie('sign') ? $.cookie('sign') : '';
                dataCenter.getSign({'sign':signCoo}, function(res){
                    if(res.STATUS){
                        console.log('验证成功');
                    }else{
                        var getSign = setInterval(function(){
                            var signWord = getSignData();
                            if(signWord){
                                $.cookie('sign', signWord, { expires: 1, path: '/' });
                                dataCenter.getSign({'sign':signWord}, function(res){
                                    if(res.STATUS){
                                        console.log('验证成功');
                                    }
                                })
                                clearInterval(getSign);
                            }
                        },100);
                    }
                })  
                setTimeout(function(){vm.$root.getListGoods(index)},10);
            }(),
            getListGoods: function(index){
                dataCenter.sourceRecord(index,function(res){
                    $.each(res.rows, function(index,item){
//                        console.log(item.type)
                        vm.$data.todos.push({
                            index:vm.$data.iter+=1,
                            type:item.type,
                            score:item.score,
                            scoreTypeInfo: item.scoreTypeInfo,
                            gmtCreate: comming.formatTime(item.gmtCreate,"m")
                        })
                    }) 
                    $('.load').fadeOut(500);
                },function(err){console.log(err);});
            },
            isAddScroll: function(){
                $(window).scroll(function(){
                     if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        index+=1;
                        vm.$root.getListGoods(index);
                     }
                 });
            }(),
            getUserScore: function(sign){               
                dataCenter.statisticalScore({'sign':sign},function(res){
                    if(res.STATUS){                        
                        vm.$data.score = res.score?res.score:0;//总分
                        vm.$data.usedScore = res.usedScore?res.usedScore:0;//已使用
                        $('.sou').text(res.score-res.usedScore);
                        $('#mysource').show();
                        $('.load').fadeOut(500);
                    }
                },function(err){console.log(err)})
            }()
        }
    })
})