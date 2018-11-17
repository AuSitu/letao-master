$(function () {
    var letao = new Letao();
    letao.register();
    letao.getVcode();

});

var Letao = function () {

};

Letao.prototype = {
    register: function () {

        var that = this;

        $('.btn-register').on('tap', function () {

            var check = true;
            mui(".mui-input-group input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    // mui.alert(label.innerText + "不允许为空");
                    mui.toast(label.innerText + "不允许为空", {
                        duration: 'long',
                        type: 'div'
                    })
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                var userName = $('.userName').val();
                var mobile = $('.mobile').val();
                var passWord1 = $('.passWord1').val();
                var passWord2 = $('.passWord2').val();
                var vcode = $('.vcode').val();

                if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
                    mui.toast('手机号输入不合法', {
                        duration: 'long',
                        type: 'div'
                    });
                    return;
                }

                if (passWord1 != passWord2) {
                    mui.toast('两次密码输入不一致', {
                        duration: 'long',
                        type: 'div'
                    });
                    return;
                }

                if (vcode != that.vCode) {
                    mui.toast('请输入正确的验证码', {
                        duration: 'long',
                        type: 'div'
                    });
                    return;
                }

                $.ajax({
                    url: '/user/register',
                    type: 'post',
                    data: {
                        username: userName,
                        password: passWord1,
                        mobile: mobile,
                        vCode: vcode,
                    },
                    success: function (obj) {
                        // console.log(obj);
                        // console.log(obj.message);

                        if ( obj.error){
                            mui.toast(data.message, { duration: 'long', type: 'div' });
                        }else{
                            var returnUrl =that.getQueryString('returnUrl');
                            // console.log(returnUrl);
                            location.href = 'login.html?returnUrl=' + returnUrl;
                        }

                    }
                });
            }

        })
    },

    //获取验证码
    getVcode: function () {
        var that = this;

        $('.get-vcode').on('tap', function () {

            $.ajax({
                url: '/user/vCode',
                success: function (obj) {
                    console.log(obj.vCode);
                    that.vCode = obj.vCode;
                }
            });
        })
    },

    //自己写的一个根据地址栏指定参数的名称获取参数值 
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}