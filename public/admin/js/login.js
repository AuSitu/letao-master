$(function () {
    var letao = new Letao();
    letao.login();
});

var Letao = function () {

}

Letao.prototype = {
    login: function () {

        $('.btn-login').on('click', function () {


            var check = true;

            $(".login-form input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.parentNode.previousElementSibling;
                    console.log(label);

                    alert(label.innerText + "不允许为空");
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                var username = $('.username').val();
                var password = $('.password').val();
                $.ajax({
                    url: '/employee/employeeLogin',
                    type: 'post',
                    data: {
                        username: username,
                        password: password
                    },
                    success: function (obj) {
                        if (obj.error) {
                            alert(obj.message);
                        } else {
                            location.href = 'index.html';
                        }

                    }
                })

            }

        })
    },

}