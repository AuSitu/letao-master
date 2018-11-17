$(function() {
    var letao = new Letao();
    //调用注册函数
    letao.register();
    letao.getVode();
});

var Letao = function() {

}

Letao.prototype = {
    vCode:'',
    //注册函数
    register: function() {
        var that = this;
        // 1. 给注册按钮添加点击事件
        $('.btn-register').on('tap', function() {
            // 2. 获取当前输入的用户名
            var username = $('.username').val();
            //3. 获取当前输入的手机号
            var mobile =  $('.mobile').val();
            // 3. 获取当前输入的用密码
            var password1 = $('.password1').val();
            // 4. 获取确认密码
            var password2 = $('.password2').val();
            // 5. 获取验证码
            var vCode = $('.vcode').val();
            // 6. mui写的提示判断
            var check = true;
            // 遍历了所有的输入框
            mui(".mui-input-group input").each(function() {
                //2. 获取当前输入框的值 若当前input为空，则使用MUI消失提示框提醒 
                if (!this.value || this.value.trim() == "") {
                		// 3. 获取当前输入框左边的label标签
                    var label = this.previousElementSibling;
                    // 4.调用提示框提示
                    mui.toast("请输入"+label.innerText , { duration: 2000, type: 'div' });
                    // 5. 把check变量变成了false
                    check = false;
                    return false;
                }
            }); 
            //7. 非空校验通过，继续执行业务逻辑 
            if (check) {
            	// 8. 判断2次输入的密码一致
                if(password1 != password2){
                     mui.toast('两次输入的密码不一致' , { duration: 2000, type: 'div' });
                    return false;
                }
                // 9. 判断当前输入的验证码和之前获取的验证码是否一致
                if(that.vCode != vCode){
                    mui.toast('验证码输入错误' , { duration: 2000, type: 'div' });
                    return false;
                }
                // 10. 如果表单验证通过就调用注册的API实现用户的注册
                $.ajax({
                	type:'post',
                	url:'/user/register',
                	data:{username:username,password:password1,mobile:mobile,vCode:vCode},
                	success:function (data) {
                		// 11. 判断如果后台返回错误也要提示用户
                        if(data.error){
                            mui.toast(data.message , { duration: 2000, type: 'div' });
                            return false;
                        }else{
                            // 12. 注册成功一般就去登录
                            location.href = 'login.html?returnUrl=index.html';                            
                        }
                	}
                })
            }
        });
    },
    //获取验证码的函数
    getVode:function () {
        var that = this;
        // 1. 给获取验证码按钮添加点击事件去获取验证码
        $('.btn-getvCode').on('tap',function () {
           // 2. 调用获取验证码的API
           $.ajax({
              url:'/user/vCode',
              success:function (data) {
                 console.log(data.vCode);
                  //3. 获取到了验证码给对象上的vCode赋值 这个vCode是后台返回的vCode
                  that.vCode = data.vCode;
              }
           }) 
        });
    }
}
