$(function() {
    var letao = new Letao();
    //调用乐淘后台的登录方法
    letao.login();
});

var Letao = function() {

}

Letao.prototype = {
    //乐淘后台登录函数
    login: function() {
        // 1. 给登录按钮添加点击事件
        $('.btn-login').on('click', function() {
            // 2. 获取用户名和密码
            var username = $('#username').val();
            var password = $('#password').val();
            // 3. 对表单输入进行判断
            var check = true;
            // 遍历了所有的输入框
            $(".form-group input").each(function() {
                //2. 获取当前输入框的值 若当前input为空，则使用MUI消失提示框提醒 
                if (!this.value || this.value.trim() == "") {
                    // 3. 获取当前输入框的父元素div前面的label
                    var label = this.parentNode.previousElementSibling;
                    // 4.调用提示框提示
                    alert("请输入" + label.innerText);
                    // 5. 把check变量变成了false
                    check = false;
                    return false;
                }
            });
            //4. 校验通过，继续执行业务逻辑 
            if (check) {
            	// 5. 调用后台登录的API实现登录
            	$.ajax({
            		type:'post',
            		url:'/employee/employeeLogin',
            		data:{username:username,password:password},
            		success:function (data) {
            			// 6. 判断当前是否登录成功 如果不成功就提示用户
            			if(data.error){
            				alert(data.message)
            			}else{
            				// 7. 等成功就跳转到主页
            				location.href = 'index.html';
            			}
            		}
            	})
            }
        });
    }
}
