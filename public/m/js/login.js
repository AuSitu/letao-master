$(function () {
    var letao = new Letao();

    letao.login();
    letao.register();
});


var Letao = function () {

}

Letao.prototype = {

    

    login: function () {

        var that = this;

        $('.btn-login').on('tap', function () {
            //开关思想,验证是否通过,默认true
            var check = true;

            mui(".mui-input-group input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    // mui.alert(label.innerText + "不允许为空");
                    mui.toast(label.innerText + "不允许为空",{ duration:'short', type:'div' }) 

                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                var userName = $('.userName').val();
                var passWord = $('.passWord').val();

                $.ajax({
                    url:'/user/login',
                    type:'post',
                    data:{
                        username:userName,
                        password:passWord,
                    },
                    success: function(obj){
                        // console.log(obj);
                        // console.log(obj.message);
                        // console.log(obj.error);
                        if(obj.error == 403 ){
                            mui.toast(obj.message+'请重新输入',{ duration:'short', type:'div' }) 
                        }else{
                            var returnUrl = that.getQueryString('returnUrl');
                            console.log(returnUrl);
                            location.href = returnUrl;
                        }
                    }
                });
            }
        });
    },

    //从登录页面跳转到注册
    register: function(){
        var  that = this;
        $('.register').on('tap',function(){

            //获取当前登录页面登录成功后要返回的页面(比如详情页)
            var returnUrl = that.getQueryString('returnUrl');
            console.log(returnUrl);
            location.href = 'register.html?returnUrl='+returnUrl;

            
        });
    },


    //自己写的一个根据地址栏指定参数的名称获取参数值 
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}