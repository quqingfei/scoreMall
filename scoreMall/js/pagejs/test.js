  (function ($) {
  $(window.document).ready(function () {

      $('.load').hide();
    var signWord;  
    var dataCenter = $.getDataCenterIntance();//所有接口
    var comming = $.getComming();//公共方法
    var getSign = setInterval(function(){
                    signWord = getSignData();
       // signWord='OKveW0u2NSvwXsjetkD5cee4qLsAdN4OOLnWJ+SpdZN6M7SV1xqq++LtUeezauf8alMiG0b8z+D7uj1V4GG7Fw=='
                    if(signWord!=''){
                        $.cookie('sign', signWord, { expires: 1, path: '/' });
                        dataCenter.getSign({'sign':signWord}, function(res){
//                            alert(signWord+",    "+res.INFO);
                            if(res.STATUS){                                        
                                vm.$root.getUserScore(signWord);
                                vm.$root.getUserHead();
                                $('#mysource').show();
                                $('.load').fadeOut(500);
                            }else{
                                console.log(res.INFO);
                            }
                        })
                        clearInterval(getSign);
                    }
                },100);
    var vm = new Vue({
        el:'#mysource',
        data:{
            todos:[],
            imgUrl: '../file/FileCenter!showImage2.zk?name=',
            imgHead: '',
            userName:'未知用户',
            score: '',
            userid:'',
            usedScore:''
        },
        methods:{
            getSign: function(){
                setTimeout(function(){
                    $('.load').fadeOut(500);
                },5000);           
            }(),
            getUserHead: function(){
                 dataCenter.getUserInfo(function(res){
                    if(res.total){                        
                        vm.$data.imgHead = vm.$data.imgUrl+res.rows[0].getHeadIcon;//用户头像
                        vm.$data.userName = res.rows[0].userName;//用户名
                        $('.headName').html(res.rows[0].userName);
                    }else{
                        vm.$data.imgHead = 'img/defaulthead.png';//用户头像
//                        vm.$data.userName = '未知用户';//用户名
                        $('.headName').html('未知用户');
                    }
                     $('.header').css({'marginTop':($('.head').height()-$('.header').height())+'px','marginLeft':($('.head').width()-$('.header').width())/2+'px'})
                },function(err){console.log(err)});
            },
            getUserScore: function(sign){               
                dataCenter.statisticalScore({'sign':sign},function(res){
                    if(res.STATUS){                        
                        vm.$data.score = res.score?res.score:0;//总分
                        vm.$data.usedScore = res.usedScore?res.usedScore:0;//已使用
                        $('#headCoin').html(res.score-res.usedScore);
                        $('#mysource').show();
                        $('.load').fadeOut(500);
                    }
                },function(err){console.log(err)})
            },
            //获取商品
            getShowGoods: function(){
                dataCenter.getShowGoods(function(res){
                    $.each(res.rows,function(index,item){
                        item.cover = '../file/FileCenter!showImage2.zk?name='+item.cover+'&style=50Q';
                        vm.$data.todos.push(item);
                    })
                },function(err){console.log(err)});
            }()
        }
    });
  })
})(jQuery);
