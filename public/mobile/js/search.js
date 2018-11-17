$(function () {
	var letao = new Letao();
	//调用添加搜索历史记录的方法
	letao.addHistory();
	// 调用查询搜索记录方法
	letao.queryHistory();
	//调用删除历史记录的方法
	letao.removeHistory();
	//调用清空历史记录的方法
	letao.clearHistory();
});

var Letao = function () {
	
}

Letao.prototype = {
	//添加搜索历史记录
	addHistory:function () {
		//把this letao对象 保存在that变量里面
		var that = this;
		// 1. 给搜索按钮添加点击事件
		$('.btn-search').on('tap',function () {
			// 2. 获取当前输入输入的搜索的文本
			var search = $('.input-search').val();
			//点击搜索的时候把输入框清空
			$('.input-search').val('');
			// 3. 判断如果当前search为空就return 提示用户输入
			if(!search.trim()){
				alert('请输入搜索的商品')
				return;
			}
			// 4. 把搜索的内容添加到本地存储中 不仅要把值存进去 还要给这条数据指定一个id
				//而且存储的时候存储多条记录使用数组的方式存储
			// 定义一个id默认为1  如果本地存储中有值 id就最后一条数据的id+1
			// 5. 定义一个对象保存当前存储到数据库里面搜索记录
			var searchObj = {
				id:1,
				search:search
			}	
			// 6. 定义历史记录的数组 如果本地存储中没有值 第一次添加为空数组 如果有值就为本地存储中的值
			var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
			// 7. 判断如果数组的长度大于0 当前记录的id就为最后一个值的id+1
			if(historyList.length > 0){
				searchObj.id = historyList[historyList.length-1].id+1;
			}
			// 8. 把当前的搜索记录添加到历史记录的数组中
			historyList.push(searchObj);
			// 9. 把整个历史记录的数组存储到本地存储中
			localStorage.setItem('historyList',JSON.stringify(historyList));
			// 10.添加完成后如果要显示最新 就调用查询的方法
			that.queryHistory();
			// 11. 历史记录真正添加完成后跳转到商品列表实现真正的商品搜索 
			//从搜索页面跳转到商品列表并且把我搜索页面搜索的关键字传递到商品列表 只能通过url传递
			window.location.href = 'productlist.html?search='+search;
		});
	},
	//查询搜索历史记录
	queryHistory:function () {
		// 1. 获取本地存储的数组 如果本地存储没有值就默认为空
		var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
		// 如果需要按照最新的搜索的内容在最前面显示
		historyList = historyList.reverse();
		// 2. 调用模板生成html
		var html = template('historyTmp',{rows:historyList});
		// 3. 把生成 html放到历史记录的ul里面
		$('.search-history .content ul').html(html);
	},
	//删除搜索历史记录
	removeHistory:function () {
		var that = this;
		// 1. 给所有的x添加点击事件
		$('.search-history .content ul').on('tap','.btn-delete',function () {
			// 2. 获取当前点击的x对应要删除的id
			var id = $(this).data('id');
			// 3. 获取本地存储的数组
			var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
			// 4. 从数组中删除id和当前点击x的id一致的值
			//5. 循环变量这个数组
			for (var i = 0; i < historyList.length; i++) {
				// 6. 判断数组的每一个值的id 和 当前要删除的id一致的值
				if(historyList[i].id == id){
					// 7. 从数组中删除这个值 splice是删除数组中的一个值 第一个参数是删除的索引第二个参数是往后删几个
					historyList.splice(i,1);
				}
			}
			// 8. 删除完成后要把删除后的数组保存到本地存储中
			localStorage.setItem('historyList',JSON.stringify(historyList));
			// 9.删除后如果需要刷新列表 调用查询方法
			that.queryHistory();
		})
	},
	//清空历史记录
	clearHistory:function () {
		var that = this;
		// 1. 给清空按钮添加单击事件
		$('.btn-clear').on('tap',function () {
			// 2. 给本地存储的值清空 删除掉整个历史记录的键
			localStorage.removeItem('historyList');
			// 3. 清空完成调用查询刷新页面
			that.queryHistory();
		});
	}
}