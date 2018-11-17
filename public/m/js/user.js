$(function(){
    var letao = new Letao();
    letao.queryUserMessage();
    letao.exit();
})


var Letao = function(){

}

Letao.prototype = {
    queryUserMessage:function(){
        $.ajax({
            url:'/user/queryUserMessage',
            success:function(obj){
                console.log(obj);
                if(obj.error){
                    location.href='login.html?returnUrl=' + location.href;
                } else{
                    
                    $('.username span').html(obj.username)
                    $('.mobile span').html(obj.mobile)
                }
            }
        })
    },
    exit : function(){
        $('.btn-exit').on('tap',function(){
            $.ajax({
                url:'/user/logout',
                success: function(obj){
                    if(obj.success){
                        location.href = 'login.html?returnUrl=' + location.href;
                    }
                }
            })
        })
    }
}