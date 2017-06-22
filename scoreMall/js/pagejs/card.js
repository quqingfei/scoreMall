    $(function(){
       
        
        // $('.choosecolor a').click(function(){
        //     $(this).addClass('choose-ser-color').siblings().removeClass('choose-ser-color');
        //     var colorvalue = $(this).attr('data-vlaue');
        //     var detiale_text = $('.detiale-text');
        //     switch(colorvalue){
        //         case  'green':  detiale_text.html('<span class="hcose">已选择：绿色</span>');  break;
        //         case 'purple':  detiale_text.html('<span class="hcose">已选择：紫色</span>');  break;
        //     }
        //     var s = parseInt($('#number').attr('data-value'));
        //     detiale_text.html(detiale_text.text()+',已选<span class="chosenum">'+s+'</span>件')
        // })
        $('.submit').click(function(){
                    
        })
        $('.chicun').click(function(){
            $('.zhezhao').fadeIn(200);
            $('.dindan').css('bottom',0);
        })
        $('.close, .zhezhao').click(function(){
            $('.zhezhao').fadeOut(200);
            $('.dindan').css('bottom','-100%');
        })        
        
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
    })