$(function() {
    var letao = new Letao();
    letao.login();
});

var Letao = function() {

}

Letao.prototype = {
    //登录函数
    login: function() {
    	  var that = this;
        // 1. 给登录按钮添加点击事件
        $('.btn-login').on('tap', function() {
            // 2. 获取当前输入的用户名
            var username = $('.username').val();
            // 3. 判断当前是否输入了用户名
            // if (!username) {
            // 4. 调用MUI的消失提示框 提示输入用户名
            // mui.toast('请输入用户名', { duration: 2000, type: 'div' });
            // 5. 也要retrun然后面代码不执行
            // return false;
            // }
            // 6. 获取当前输入的用密码
            var password = $('.password').val();
            // if (!username) {
            // 4. 调用MUI的消失提示框 提示输入用户名
            // mui.toast('请输入密码', { duration: 2000, type: 'div' });
            // 5. 也要retrun然后面代码不执行
            // return false;
            // }
            // 7. mui写的提示判断
            var check = true;
            // 遍历了所有的输入框
            mui(".mui-input-group input").each(function() {
                //2. 获取当前输入框的值 若当前input为空，则使用MUI消失提示框提醒 
                if (!this.value || this.value.trim() == "") {
                    // 3. 获取当前输入框左边的label标签
                    var label = this.previousElementSibling;
                    // 4.调用提示框提示
                    mui.toast("请输入" + label.innerText, { duration: 2000, type: 'div' });
                    // 5. 把check变量变成了false
                    check = false;
                    return false;
                }
            });
            //校验通过，继续执行业务逻辑 
            if (check) {
                console.log(1);
                // 8. 如果用户名和密码都输入了就调用APi实现登录
                $.ajax({
                    type: 'post',
                    url: '/user/login',
                    data: { username: username, password: password },
                    success: function(data) {
                        // 9. 判断是否登录成功
                        if (data.error) {
                            // 10. 把错误信息提示给用户
                            mui.toast(data.message, { duration: 2000, type: 'div' });
                        } else {
                            // 11. 否则就表示登录成功 返回上一页 但是如果上一页是注册返回首页
                            var returnUrl = that.getQueryString('returnUrl');
                            console.log(returnUrl);
                            // 12. 返回到returnUrl这个页面
                            location.href = returnUrl;
                        }
                    }
                })
            }
        });
    },
    //专门获取地址栏参数的方法
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
}
