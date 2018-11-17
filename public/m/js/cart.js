$(function () {
    var letao = new Letao();
    letao.queryCart();
    letao.pullDownUpRefresh();
    letao.deleteCart();
    letao.editCart();
    letao.getSum();

})

var Letao = function () {

};

Letao.prototype = {

    //查询购物车订单的
    queryCart: function () {

        var that = this;

        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 5
            },
            beforeSend: function () {
                // 把遮罩层显示出来
                $('.mask').show();
            },
            //发送请求完毕后去隐藏遮罩层
            complete: function () {
                // 把遮罩层显示出来
                $('.mask').hide();
            },
            success: function (obj) {
                console.log(obj);

                if (obj.error) {
                    
                    location.href = 'login.html?returnUrl=cart.html';
                }else{
                    var cartHtml = template('cartTpl', obj);
                    $('.cart-list').html(cartHtml);
                }

               
            }
        })
    },

    //购物车商品的下拉刷新和上拉加载更多
    pullDownUpRefresh: function () {

        var page = 1;

        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                $.ajax({
                    url: '/cart/queryCartPaging',
                    data: {
                        page: 1,
                        pageSize: 5
                    },
                    success: function (obj) {
                        // console.log(obj);
                        var cartHtml = template('cartTpl', obj);
                        $('.cart-list').html(cartHtml);
                    }
                })
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

                page = 1

                mui('#pullrefresh').pullRefresh().refresh(true);



            }, 1500);
        }
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                $.ajax({
                    url: '/cart/queryCartPaging',
                    data: {
                        page: ++page,
                        pageSize: 5
                    },
                    success: function (obj) {
                        console.log(obj);
                        // console.log(obj.data);//undefined

                        if (!obj.data) {
                            obj = {
                                data: []
                            }
                        }
                        console.log(obj);

                        if (obj.data.length > 0) {
                            var cartHtml = template('cartTpl', obj);
                            $('.cart-list').append(cartHtml);
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(); //参数为true代表没有更多数据了。

                        } else {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
                        }
                    }
                })

            }, 1500);
        }
    },

    //删除购物的商品
    deleteCart: function () {

        var that = this;

        $('.cart-list').on('tap', '.btn-delete', function () {

            // console.log(this);

            var li = this.parentNode.parentNode;
            // var li = $(this).parent().parent()[0]
            // console.log(li);
            var singleId = $(this).data('id');
            // console.log(singleId);


            mui.confirm('您确定要删除吗?', '温馨提醒', ['是', '否'], function (e) {
                // console.log(e);
                if (e.index == 0) {
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: singleId
                        },
                        success: function (obj) {
                            if (obj.success) {
                                mui.toast('删除成功');
                                that.queryCart();
                            } else {
                                location.href = 'login.html?returnUrl=' + location.href;
                            }

                        }
                    });

                } else {
                    setTimeout(function () {
                        mui.swipeoutClose(li);
                    }, 0);
                }

            })
        })
    },

    //编辑功能
    editCart: function () {
        var that = this;

        $('.cart-list').on('tap', '.btn-edit', function () {

            var singleProduct = $(this).data('product');
            console.log(singleProduct);
            var li = this.parentNode.parentNode;

            var size = [];
            for (var i = singleProduct.productSize.split('-')[0]; i <= singleProduct.productSize.split('-')[1]; i++) {
                // size.push(i);
                size.push(parseInt(i))
            }
            singleProduct.productSize = size;

            var html = template('editTpl', singleProduct);
            html = html.replace(/[\r\n]/g, "")
            // console.log(html);

            mui.confirm(html, '编辑商品的标题', ['确定', '取消'], function (e) {


                if (e.index == 0) {
                    var size = $('.btn-size.active').data('size');
                    var num = mui('.mui-numbox').numbox().getValue();

                    //console.log(size);
                    //console.log(num);

                    $.ajax({
                        url: '/cart/updateCart',
                        type: 'post',
                        data: {
                            id: singleProduct.id,
                            size: size,
                            num: num
                        },
                        success: function (obj) {
                            // console.log(obj);
                            if (obj.success) {
                                mui.toast('编辑成功');
                                that.queryCart();
                            } else {
                                location.href = 'login.html?returnUrl=' + location.href;
                            }
                        }
                    })
                } else {
                    setTimeout(function () {
                        mui.swipeoutClose(li);
                    }, 0);
                }
            });

            mui('.mui-numbox').numbox();

            $('.btn-size').on('tap', function () {
                $(this).addClass('active').siblings().removeClass('active');
            })

        })
    },

    //计算总金额
    getSum: function () {
        $('.cart-list').on('change', 'input[type="checkbox"]', function () {

            var checkeds = $('input[type="checkbox"]:checked');
            // console.log(checkeds);

            var sum = 0;
            checkeds.each(function (index, ele) {
                var singleCount = 0;

                //把价格数量绑定到input标签的自定义属性上  通过data函数获取自定义属性的值
                var price = $(ele).data('price');
                var num = $(ele).data('num');

                singleCount = price * num;

                sum += singleCount;
            });
            sum = sum.toFixed(2);

            $('.order-count span').html(sum)
        })
    },




    
    //自己写的一个根据地址栏指定参数的名称获取参数值 
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

}