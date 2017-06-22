$(function(){
    $('.proDetail').css('width',($(window).width()-$('.pro-img').offset().left*2-155)+'px');
    $(window).resize(function () {  
        $('.proDetail').css('width',($(window).width()-$('.pro-img').offset().left*2-155)+'px');
        htmlfont();
    })
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
    function zkPay(id,type) {
        if (!window.WebViewJavascriptBridge) {
            return false;
        }
        window.WebViewJavascriptBridge.callHandler('zkPay', {onLinePayId:id,payType:type},
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
//            if(confirm('确定要取消订单？')){                
                history.back();
//            }
            var responseData = 'success';
            responseCallback(responseData);
        });
         bridge.registerHandler('zkPaySuccess',function(data, responseCallback) { 
            if(data == "success"){
                window.location.href = 'list.html'
            }
            responseCallback(data);
        }); 
        bridge.registerHandler('readyBack',function(data, responseCallback) {
            readyBack();
            var responseData = {
                'Javascript Says': 'readBack!'
            };
            responseCallback(responseData);
        });    

    });
    if($.cookie('name') == "" || $.cookie('producter')=="" || $.cookie('id')=="" || $.cookie('typeName')=="" || $.cookie('typeName')=="" ||$.cookie('price')=="" ||$.cookie('num')==""){
        window.location.href = 'mysource.html'
    }
    var dataCenter = $.getDataCenterIntance();//所有接口
    var comming = $.getComming();//公共方法
    var vm = new Vue({
        el:'#regect',        
        data:{
            todos:[],
            imgUrl: '../file/FileCenter!showImage2.zk?name=',
            name: $.cookie('name'),
            producter: $.cookie('producter'),
            id: $.cookie('id'),
            typeName: $.cookie('typeName'),
            bannerType: $.cookie('bannerType'),
            typePrice: $.cookie('typePrice'),
            price: $.cookie('price'),
            num: $.cookie('num'),
            k:'快递配送',
            usercoin: 0,
            mores:0,
            s:1,
            other:0,
            zitiArdsss:'湖北省武汉市武昌区水果湖东湖路10号水果湖广场2楼',
            defaultAddress:"",
            receiverAddress: ""
        },
        methods:{
            getSign: function(){
                var signCoo = $.cookie('sign') ? $.cookie('sign') : '';
                dataCenter.getSign({'sign':signCoo}, function(res){
                    if(res.STATUS){
                        vm.$root.getUserScore(signCoo);
                        console.log('验证成功');
                    }else{
                        var getSign = setInterval(function(){
                            var signWord = getSignData();
                            if(signWord){
                                $.cookie('sign', signWord, { expires: 1, path: '/' });
                                dataCenter.getSign({'sign':signWord}, function(res){
                                    if(res.STATUS){
                                        vm.$root.getUserScore(signWord);
                                        console.log('验证成功');
                                    }
                                })
                                clearInterval(getSign);
                            }
                        },100);
                    }
                })
                setTimeout(function(){
                    $('.load').fadeOut(500);
                },5000);       
            }(),
            getAddress: function(){
                dataCenter.getUserAddress(function(res){
                    if(res.STATUS){
                        if(res.total){
                            $.each(res.rows,function(index,item){ 
                                if(item.isDefault == 'y'){                               
                                    $('.address').append('<div class="addressDetials shouhuo"><a class="link" href="addresslist.html"><div class="addressDetialLeft"><div class="add1">收货地址</div><div>姓名：'+item.receiver+'</div><div>电话：'+item.phone+'</div><div>地址：'+item.address+'</div></div><div class="addressDetialright"><c class="addAdd"></c></div></a></div>');
                                    vm.$data.defaultAddress = item.address;
                                }
                            })
                            var h = $('.addressDetials').height();
                            $('.addAdd').css({'height': h+'px','lineHeight': h+'px'});
                            $('.ser').css({'marginTop': ((h-$('.ser').height())/2)+'px'});
                             $('.load').fadeOut(500); 
                        }else{
                            $('.address').append('<a class="chicun shouhuo" href="address.html"><call class="chuser"><img src="img/addressicon.png" alt="">&nbsp;请填写收货地址</call><span></span></a>');
                             $('.load').fadeOut(500);
                        }
                    }else{
                        alert(res.INFO);
                    }
                },function(err){console.log(err)})
            }(),
            buyNow:function(){
                if($('.bottomLan').attr('data-index') == 0){
                    dataCenter.buyScoreGood({
                        productId:vm.$data.id,
                        count:vm.$data.num,
                        type:vm.$data.typeName,
                        cover:vm.$data.bannerType,
                        name:vm.$data.name,
                        price:  $('.btn-s').attr('val')==1?0:(vm.$data.typePrice*vm.$data.numnum - vm.$data.mores/100) <= 0.01?0:vm.$data.mores,
                        postType: vm.$data.k == "门店自提"?1:0,
                        receiverAddress:vm.$data.receiverAddress==""?vm.$data.zitiArdsss:vm.$data.receiverAddress
                    },function(res){
                        if(res.STATUS){
                            var type = $('#zhif').find('.grd').attr('val');
                            zkPay(res.onLinePayId,type);
                            
                            $('.bottomLan').attr('data-index',1);
                            $.removeCookie('name', { path: '/' });
                            $.removeCookie('producter', { path: '/' });
                            $.removeCookie('id', { path: '/' });
                            $.removeCookie('typeName', { path: '/' });
                            $.removeCookie('bannerType', { path: '/' });
                            $.removeCookie('typePrice', { path: '/' });
                            $.removeCookie('price', { path: '/' });
                            $.removeCookie('num', { path: '/' });
//                            window.location.href = 'success.html';
                        }else{
                            alert(res.INFO);
                            $('.bottomLan').attr('data-index',0);
                        }
                    },function(err){console.log(err)});
                }
            },
            getUserScore: function(sign){               
                dataCenter.statisticalScore({'sign':sign},function(res){
                    if(res.STATUS){                        
                        vm.$data.score = res.score?res.score:0;//总分
                        vm.$data.usedScore = res.usedScore?res.usedScore:0;//已使用
                        vm.$data.usercoin = parseInt(res.score-res.usedScore);//用户有多少燃脂币
                        vm.$data.mores = vm.$data.usercoin>=vm.$data.price?vm.$data.price:vm.$data.usercoin;
                        vm.$data.other = vm.$data.usercoin>=vm.$data.price?vm.$data.price:vm.$data.usercoin
                    }
                },function(err){console.log(err)})
            },
            showDown: function(){
                if($('.downicon').attr('val')==0){
                    $('.downicon').attr('val',1);
                    $('.mdsk').show();
                }else{
                    $('.downicon').attr('val',0);
                    $('.mdsk').hide();
                }                
            },
            showUp: function(e){
                e.stopPropagation();
                $('.downicon').attr('val',0);
                if(vm.$data.k == "门店自提"){                    
                    vm.$data.k = "快递配送";
                    $('#ziti').hide();
                    vm.$data.receiverAddress=vm.$data.defaultAddress;
                    $('.yunfei,.shouhuo').css('display','block');
                    $('.mdsk').text('门店自提');
                }else{
                    $('#ziti').show();
                    vm.$data.receiverAddress="";
                    $('.yunfei,.shouhuo').css('display','none');
                    vm.$data.k = "门店自提";
                    $('.mdsk').text('快递配送');
                }
                $('.mdsk').hide();
            },
            diyong: function(){
                if($('.btn-s').attr('val')==0){             
                    $('.btn-s').addClass('btnsb');
                    $('.btn-a').addClass('closes');
                    $('.btn-s').attr('val',1);
                    $('.coin').attr('disabled','true').css('border','1px solid #ccc');                
                    vm.$data.s = 0;     
                }else{
                    $('.btn-s').attr('val',0);
                    $('.btn-s').removeClass('btnsb');
                    $('.btn-a').removeClass('closes');
                    $('.coin').removeAttr('disabled').css('border','1px solid #3fc371');
                    vm.$data.s = 1;   
                }
            },
            zhifub: function(e){
                var el = e.currentTarget;
                $('.grd').removeClass('grd');
                $(el).find('.rod span').addClass('grd');
            },
            weixin: function(e){
                var el = e.currentTarget;
                $('.grd').removeClass('grd');
                $(el).find('.rod span').addClass('grd');
            },
            duicoin: function(){
                var zhengshu = /^[0-9]\d*$/;
                if(vm.$data.mores==""){return false;}
                if(!zhengshu.test(vm.$data.mores)){
                    alert('请输入正整数!');
                    return false;
                }
                if(vm.$data.mores<0){
                    vm.$data.mores=0;
                }else if(vm.$data.mores>vm.$data.other){
                    vm.$data.mores=vm.$data.other;
                }
            },
            buyScoreGood: function(){
                dataCenter.statisticalScore({'sign':sign},function(res){
                    if(res.STATUS){                        
                       dScore;//用户有多少燃脂币
                    }
                },function(err){console.log(err)})
            }
        }
    })
})