var a = {   

        login: function(){
            $.ajax({
                type:'post',
                data:{user_id:13568674985,user_pwd:123456},
//                data:{user_id:13098811229,user_pwd:123456},
                url: '../fatburn/loginAction!login.zk',
                dataType: 'json',
                success: function(data){
                   
                }
            })
        }(),
        teseloae:function(data){
            var s = encodeURI(data);
            $.ajax({
                type: 'post',
                data: {sign:s},
                url: '../fatburn/ScoreAction!checkSign.zk',
                dataType: 'json',
                success: function(data){
                    return true;
                }
            })
        },
        testlogin: function(){
            $.ajax({
                type: 'post',
                url: '../fatburn/ScoreAction!getSign.zk',
                dataType: 'json',
                success: function(data){
                                  
                    a.teseloae(data.sign);
                    
                },
                error: function(err){
                    console.log(err);
                }
            })
        }()
    } 