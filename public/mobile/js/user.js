$(function () {
	var letao = new Letao();
	//页面加载就调用获取用户信息函数
	letao.queryUserMessage();
	letao.exit();
});

var Letao = function () {
	
}

Letao.prototype = {
	//获取用户信息函数
	queryUserMessage:function () {
		// 1. 页面刚刚渲染就马上调用获取用用户信息的API
		$.ajax({
			url:'/user/queryUserMessage',
			success:function (data) {
				// 2. 判断的data是否有error
				if(data.error){
					// 3. 表示未登录 跳转到登录
					location.href = 'login.html?returnUrl=user.html';
				}else{
					// 4. 把用户名和手机号渲染成获取的信息
					$('.username').html(data.username);
					$('.mobile').html(data.mobile);
				}		
			}
		})
	},
	//退出登录功能
	exit:function () {
		// 1. 点击退出按钮实现退出登录
		$('.btn-exit').on('tap',function () {			
			// 2. 调用后台退出登录API退出
			$.ajax({
				url:'/user/logout',
				success:function (data) {
					// 3. 退出成功就跳转到登录
					if(data.success){
						location.href = 'login.html?returnUrl=user.html';
					}
				}
			})
		})
		
	}
}