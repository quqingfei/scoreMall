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
            imgUrl: '../file/FileCenter!showImage2.zk?name='
        },
        methods:{
            getSign: function(){
                var signCoo = $.cookie('sign') ? $.cookie('sign') : '';
//                var signCoo = 'OKveW0u2NSvwXsjetkD5cbd8uLy1PE0qEE6XPRl5A5hLOKypgeJyBzkn5oG1lIbtMYMCsdZp6iqnyOiuYzPsjw==';
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
                    vm.$root.getListGoods(index);
                },10);
//                setTimeout(function(){
//                    $('.load').fadeOut(500);
//                },3000);         
            }(),
             getListGoods: function(index){
                dataCenter.alExchange(index,function(res){
                    if(!res.total || res.total<=0){
                        $('.noinfation').show();
                    }else{
                        $.each(res.rows, function(index,item){
//                            vm.$data.todos.push({
//                                id:item.id,
//                                image: vm.$data.imgUrl+item.cover,
//                                name:item.name,
//                                count: item.count,
//                                type: item.type,
//                                price: item.price
//                            })
                            var s = "未兑换"
                            if(item.delivery=="n"){
                                s = "未兑换"
                            }else{
                                s = "已兑换"
                            }
                            $('#list').append('<div class="list" onClick=\"toOrderDetial(\''+item.id+'\')\"><div class="storeimg"><img src='+vm.$data.imgUrl+item.cover+' alt=""></div><div class="storetit"><div class="code">劵码: <span>'+item.id+'</span></div><div class="codetit">'+item.name+'</div><div class="codetit">类型：'+item.type+'<span style="float:right">'+s+'</span></div><div class="coind"><div class="coindser"><div class="codecoin"><span>'+item.price+'</span>燃脂币</div><div class="codenum">x'+item.count+'</div></div></div></div></div>');
                        })
//                        $('.load').fadeOut(500);
                    }       
                },function(err){console.log(err);});
            },
            isAddScroll: function(){
                $(window).scroll(function(){
                     if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        index+=1;
                        vm.$root.getListGoods(index);
                     }
                 });
            }()
            
            
        }
    })
})
function toOrderDetial(dat){
    console.log(dat)
    window.location.href = 'dingdandetial.html?id='+dat
}
