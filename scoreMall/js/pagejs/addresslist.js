$(function(){
    $(window).resize(function () {  
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
        history.back();
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
    var dataCenter = $.getDataCenterIntance();//所有接口
    var comming = $.getComming();//公共方法
    var vm = new Vue({
        el:'#addresslist',
        data:{
            todos:[],
            id: '',
            num: '',
            data: ''
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
            }(),
            getAddress: function(){
                dataCenter.getUserAddress(function(res){
                    var is = 253392681600000;
                    if(res.STATUS){
                        vm.$data.num = res.total;
                        $.each(res.rows, function(index,item){
                            vm.$data.todos.push(item);
                            if(item.isDefault == 'n'){
                                if(is > item.gmtCreate){
                                    is = item.gmtCreate;
                                    vm.$data.data = item;
                                }                                
                            }
                        })
                    }else{
                        alert(res.INFO);
                    }
                    setTimeout(function(){                        
                        vm.$root.setAheight();
                        $('.load').fadeOut(500);
                    },10);
                },function(err){console.log(err)});
            }(),
            //选择默认地址选择中
            chooseDefaultAddressType: function(id,el){
                this.id = id;
                var el = el.currentTarget;
                $(el).find('em').addClass('item');
                $(el).siblings().find('em').removeClass('item');
            },
            //设置默认地址按钮
            chooseDefaultAddress: function(){
                dataCenter.setUserAddress(vm.$data.id,function(res){
                    if(res.STATUS){
                       history.back(); ;
                    }
                },function(err){
                    console.log(err);
                })
            },
            //设置高度
            setAheight: function(){
                $('.addressDetial').each(function(){
                    var h = $(this).height();
                    var $ser = $(this).find('.ser');
                    $(this).find('.addAdd').css({'height': h+'px','lineHeight': h+'px'});
                    $ser.css({'marginTop': ((h-$ser.height())/2)+'px'});
                })               
            },
            //添加新地址+号
            addNewAddress: function(){
                if(vm.$data.num>=5){
                    $('.zhezhao').fadeIn(200);
                    $('.asd').show();
                }else{
                    window.location.href = 'address.html';
                }
            },
            //取消新地址+号
            cencleNewAddress: function(){
                $('.zhezhao').fadeOut(200);
                $('.asd').hide();
            },
            //定位高度
            addHeight: function(){
                $('.asd').css('marginTop',-$('.asd').height()+10/2+'px');
            }()
        }
    })
})