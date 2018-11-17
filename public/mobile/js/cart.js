$(function() {
    var letao = new Letao();
    //调用查询购车的方法
    letao.queryCart();
    //调用编辑购车的方法
    letao.editCart();
    //调用购车的删除方法
    letao.deleteCart();
    //调用计算总金额的方法
    letao.getCount();
});

var Letao = function() {

}

Letao.prototype = {
    //定义一个全局的page当前页码数
    page: 1,
    //定义一个每页大小
    pageSize: 5,
    //查询购物车的方法
    queryCart: function() {
        var that = this;
        // 1. 初始化下拉刷新和上拉加载更多的组件
        mui.init({
            pullRefresh: {
                //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                container: "#refreshContainer",
                //初始化下拉
                down: {
                    //默认第一次初始化就马上执行下拉刷新 马上去渲染页面
                    auto: true,
                    //下拉刷新的回调函数 写真实是的ajax请求 刷新页面
                    callback: function() {
                        //为了模拟数据请求延迟 添加一个定时器
                        setTimeout(function(argument) {
                            // 2. 在下拉刷新的时候请求数据
                            //在下拉发送请求之前要重置page
                            that.page = 1;
                            $.ajax({
                                url: '/cart/queryCartPaging',
                                data: { page: that.page, pageSize: that.pageSize },
                                success: function(data) {
                                    // 3. 请求成功渲染当前购车列表
                                    console.log(data);
                                    var html = template('cartTmp', data);
                                    // 4. 把页面放到列表的ul里面
                                    $('#cartList > .mui-table-view').html(html);
                                    // 5. 数据渲染完毕要结束下拉刷新
                                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                    //6. 还要重置上拉加载的效果 要放到请求完毕数据渲染完毕才重置
                                    mui('#refreshContainer').pullRefresh().refresh(true);
                                }
                            });
                        }, 500)
                    }
                },
                //初始化上拉
                up: {
                    //上拉加载更多的回调函数 写真实的ajax请求 加载更多数据
                    callback: function() {
                        // 2. 在上拉加载的时候去请求下一页的数据
                        setTimeout(function() {
                            // 3. 在发送强求之前要让page++ 请求下一页的数据
                            that.page++;
                            $.ajax({
                                url: '/cart/queryCartPaging',
                                data: { page: that.page, pageSize: that.pageSize },
                                success: function(data) {
                                    console.log(data);
                                    // 7. 数据返回有点问题 返回是一个[]空数组 而不是一个对象里面的data值为空  判断当前数据是否还有值 判断data.data.length 是否大于0
                                    // 判断首先数据返回不是一个数组  再判断对象里面的data数组的长度是否大于0
                                    if (data instanceof Array == false && data.data.length > 0) {
                                        // 4. 拿到下一页的数据就调用模板去渲染
                                        var html = template('cartTmp', data);
                                        // 5. 把生成的模板追加到后 append                              
                                        $('#cartList > .mui-table-view').append(html);
                                        // 6. 数据渲染后要结束上拉加载更多
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                    } else {
                                        // 8. 如果数据没有结束并且提示没有更多数据
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }
                                }
                            })
                        }, 500);
                    }
                }
            }
        });
    },
    // 编辑购物车的方法
    editCart: function() {
        // 1. 给编辑按钮添加点击
        $('#cartList').on('tap', '.btn-edit', function() {
            // 获取当前点击的编辑按钮的父元素的父元素 li
            var li = this.parentNode.parentNode;
            // 3. 准备一个编辑的尺码和数量的模板
            // 4. 准备模需要的数据  通过自定义属性获取的
            //     1.商品的所有尺码 
            //     2.当前选择的尺码 
            //     3.所有商品的数量 
            //     4.当前选择的数量   
            //     5.当前编辑的商品id         
            var product = {
                productSize: $(this).parent().data('product-size'),
                size: $(this).parent().data('size'),
                productNum: $(this).parent().data('product-num'),
                num: $(this).parent().data('num'),
                id: $(this).parent().data('id')
            };
            // 5. 对尺码进行处理把字符串30-50转成一个 [30,...50]
            var min = product.productSize.split('-')[0];
            var max = product.productSize.split('-')[1];
            var sizeArr = [];
            for (var i = min; i <= max; i++) {
                sizeArr.push(parseInt(i));
            }
            product.productSize = sizeArr;
            // 6. 调用编辑商品的模板 传入对应的数据
            var html = template('editCartTmp', product);
            // 7. 把生成的html字符串去掉里面的回车和换行如果不去掉会变成br标签
            html = html.replace(/[\r\n]/g, "");
            // 2. 弹出一个确认框  把准备好的模板放到确认框的内容
            mui.confirm(html, '编辑商品标题', ['确定', '取消'], function(e) {
                // 10. 判断当前点击了确定还是取消
                if (e.index == 0) {
                    // 11. 调用之前要获取当前最新选择的尺码和数量
                    var size = $('.btn-size.active').data('size');
                    var num = mui('.mui-numbox').numbox().getValue();
                    // 12. 调用更新购物车的API 传入当前最新选择的尺码和数量
                    $.ajax({
                        type: 'post',
                        url: '/cart/updateCart',
                        data: { id: product.id, size: size, num: num },
                        success: function(data) {
                            // 13. 判断如果返回success表示编辑成功
                            if (data.success) {
                                // 14. 提示编辑成功
                                mui.toast('编辑成功');
                                // 16. 在编辑成功的时候要把滑动列表收回 调用一个swipeoutClose方法实现关闭滑动效果
                                //但是注意这个方法传入的参数是DOM对象
                                mui.swipeoutClose(li);
                                console.log(li);
                                // 17. 把页面的尺码和数量变成编辑后的尺码和数量
                                $(li).find('.product-size span').html(size)
                                $(li).find('.product-num span').html(num);
                                // 18. 更改当前编辑按钮父元素div上的属性的值
                                $(li).find('.mui-slider-right').data('size', size);
                                $(li).find('.mui-slider-right').data('num', num);
                            } else {
                                // 15. 编辑失败 表示未登录
                                window.location.href = 'login.html?=returnUrl=cart.html';
                            }
                        }
                    });
                }
            });
            // 8. 初始化数字框 让确认框里面的数字框能够选择
            mui('.mui-numbox').numbox();
            // 9. 让尺码支持点击 让确认框里面的尺码能点击
            $('.btn-size').on('tap', function() {
                // 15. 给当前点击的尺码按钮添加active其他的删除
                $(this).addClass('active').siblings().removeClass('active');
            });
        })
    },
    // 购物车的删除方法
    deleteCart: function() {
        // 1. 给删除按钮添加点击事件
        $('#cartList').on('tap', '.btn-delete', function() {
            // 获取当前点击的删除按钮的父元素的父元素 li
            var li = this.parentNode.parentNode;
            // 获取当前要删除的商品id 
            var id = $(this).parent().data('id')
                // 2. 弹出一个确认框
            mui.confirm('您确定要删除吗？', '温馨提示！', ['确定', '取消'], function(e) {
                // 3. 判断当前点击了确定还是取消
                if (e.index == 0) {
                    // 4. 点击了确定 调用删除API传入当前要删除的id
                    $.ajax({
                        url: "/cart/deleteCart",
                        data: { id: id },
                        success: function(data) {
                            // 5. 判断返回数据是否成功
                            if (data.success) {
                                //6. 删除成功 提示删除成功
                                mui.toast('删除成功');
                                // 7. 从当前元素的父元素中 删掉自己 相当于自杀
                                // $(li).remove();
                                li.parentNode.removeChild(li);
                            } else {
                                // 7. 如果删除失败 跳转到登录
                                window.location.href = 'login.html?=returnUrl=cart.html';
                            }
                        }
                    })
                } else {
                    // 8. 如果点击了取消 就要关闭滑动列表
                    mui.swipeoutClose(li);
                }
            })
        });
    },
    //计算总金额的方法
    getCount: function() {
        // 1. 给所有的复选框添加改变事件 change事件
        $('#cartList').on('change', 'input[type="checkbox"]', function() {
            // 2. 获取所有选中的复选框
            var checkboxs = $('input[type="checkbox"]:checked');
            var sum = 0;
            // 3. 遍历所有选中的复选框
            checkboxs.each(function(index, value) {
                //4.  获取当前遍历的每个个复选框的对应的商品的价格和数量
                var price = $(value).data('price');
                var num = $(value).data('num');
                // 5. 把价格和数量相乘求得当前商品金额
                var count = price * num;
                // 6. 把每一复选框商品的金额 累加
                sum += count;
            });
            // 7. 保留总金额位小数
            sum = sum.toFixed(2);
            // 8. 把页面的总金额替换成当前计算的总金额
            $('#count .mui-pull-left span').html(sum);
        })
    }
}
