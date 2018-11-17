$(function() {
    var letao = new Letao();
    // 2. 获取当前url传递的search 赋值给letao对象的search属性
    // 获取地址栏的url中search参数 取第一个参数用=号分割取 =前面是参数名 search=
    // =号后面就是参数的值 search=鞋   拿到鞋后是一个乱码要把鞋转成正常编码
    // letao.search = decodeURI(window.location.search.split('=')[1]);
    letao.search = letao.getQueryString('search');
    //调用初始化下拉刷新和上拉加载更多的函数
    letao.initPulldownupRefresh();
    //调用搜索商品的函数
    letao.searchProductList();
    //调用商品的排序功能
    letao.productListSort();
    //调用根据url的参数来刷新页面
    letao.getProductList();
    //调用购买功能的函数
    letao.productBuy();
});
var Letao = function() {}
Letao.prototype = {
    //全局保存这个搜索的内容
    search: '',
    //定义全局的页数变量
    page: 1,
    //定义全局的没页大小的变量
    pageSize: 2,
    price:null,
    num:null,
    //初始化下拉刷新和上拉加载更多
    initPulldownupRefresh: function() {
        var that = this;
        // 4. 初始化下拉刷新（类似于初始化区域滚动）
        mui.init({
            pullRefresh: {
                //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等区域滚动 的父容器可以写类名或者id选择器
                container: "#refreshContainer",
                //初始化下拉刷新
                down: {
                    contentdown: "你当前正在往下拉",
                    contentover: "松开手就可以刷新",
                    contentrefresh: "哥正在拼命刷新...",
                    //必选，刷新函数，真实刷新当前数据（发送请求刷新数据的）
                    callback: function() {
                        //注意现在官方文档结束下拉刷新的方法有问题
                        // mui('#refreshContainer').pullRefresh().endPulldown();
                        //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束下拉刷新
                        setTimeout(function() {
                            //1. 在下拉刷新之前把page重置为1 因为上拉的时候已经把page加到没有数据 把page重置为起点
                            that.page = 1;
                            //在下拉刷新的时候 拿到了搜索的关键字 调用ajax实现搜索 刷新页面
                            // 2. 发送请求请求商品列表数据                                                    
                            that.getProductListData(function(data) {
                                //3. 把生成的html放到页面上
                                $('.productlist-content .mui-row').html(template('productlistTmp', data));
                                //4. 下拉数据渲染完毕就调用结束下拉刷新的方法
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                //5. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                                mui('#refreshContainer').pullRefresh().refresh(true);
                            });
                        }, 1000)
                    }
                },
                up: {
                    contentrefresh: "哥正在拼命加载更多...",
                    contentnomore: '在下实在是给不了给不了更多了，亲！',
                    //必选，刷新函数 发送请求请求最新下一页数据
                    callback: function() {
                        //是因为模拟请求延迟给个1秒的延迟 1秒钟后结束上拉加载
                        setTimeout(function() {
                            //1. 在上拉加载之前 先让当前页码数++  假如当前是1 ++ 完后就是2  上拉加载请求第二页数据
                            that.page++;
                            //2. 发送请求请求商品列表数据                           
                            that.getProductListData(function(data) {
                                // 3. 判断当前data.data是否有数据 如果有数据就渲染模板 如果没有数据提示没有更多数据了
                                if (data.data.length > 0) {
                                    //4. 把生成的html 追加到页面的后面
                                    $('.productlist-content .mui-row').append(template('productlistTmp', data));
                                    //5. 上拉加载据渲染完毕就调用结束上拉加载更多的方法
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                } else {
                                    //6. 结束上拉加载更多 并且提示没有更多数据
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            });
                        }, 1000);
                    }
                }
            }
        });
    },
    //实现搜索商品列表
    searchProductList: function() {
        var that = this;
        // 1. 给搜索按钮添加点击事件
        $('.btn-search').on('tap', function() {
            // 2. 获取当前输入输入的要搜索的内容
            that.search = $('.input-search').val();
            // 3. 判断search是否为空
            if (!that.search.trim()) {
                alert('请输入要搜索商品');
                return;
            }
            // 搜索前要重置page=1
            that.page = 1;
            // 4. 发送请求请求商品列表数据            
            that.getProductListData(function(data) {
                $('.productlist-content .mui-row').html(template('productlistTmp', data));
                //5. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                mui('#refreshContainer').pullRefresh().refresh(true);
                window.location.href = 'productlist.html?search='+that.search;
            });
        });
    },
    //商品的排序
    productListSort: function() {
        var that = this;
        // 1. 给价格和数量按钮添加tap事件
        $('.product-list .title a').on('tap', function() {
            // 2. 获取当前点击的a的排序类型
            var sortTpye = $(this).data('sort-type');
            // 3. 获取当前点击a的排序的顺序 1 是升序  2是降序
            var sort = $(this).data('sort');
            // 4. 改变当前a排序顺序 如果你之前是1  点击后应该改成2  如果之前是2点击后改为1            
            // 判断sort == 1 为真返回2 否则为假返回1
            sort = sort == 1 ? 2 : 1;
            that.page = 1;
            // 5. 更新当前a排序的顺序
            $(this).data('sort', sort);
            // 6. 判断当前的排序的方式 如果是价格 就调用api传入价格排序  如果是数量调用api传入数量的排序
            if (sortTpye == 'price') {
                // 7. 发送请求请求商品列表数据
                that.getProductListData(function(data) {
                    //8. 把生成的html放到页面上
                    $('.productlist-content .mui-row').html(template('productlistTmp', data));
                    //9. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                    mui('#refreshContainer').pullRefresh().refresh(true);
                });
                that.price = sort;
                that.num = null;
            } else {
                // 10. 发送请求请求商品列表数据
                that.getProductListData(function(data) {
                    $('.productlist-content .mui-row').html(template('productlistTmp', data));
                    //11. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                    mui('#refreshContainer').pullRefresh().refresh(true);
                });
                that.num = sort;
                that.price = null;
            }
        })
    },
    //根据url搜索的内容调用api刷新页面
    getProductList: function() {
        var that = this;
        // 搜索前要重置page=1
        that.page = 1;
        // 1. 发送请求请求商品列表数据
        that.getProductListData(function(data) {
            //2. 把生成的html放到页面上
            $('.productlist-content .mui-row').html(template('productlistTmp', data));
            //3. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
            mui('#refreshContainer').pullRefresh().refresh(true);
        });
    },
    // 这个函数是专门用来获取商品列表数据的函数
    getProductListData: function(callback,params) {
        var that = this;
        // 1. 发送请求请求商品列表数据
        $.ajax({
            url: '/product/queryProduct',
            //注意由于API必须传入page和pageSize 如果不传黑窗会挂掉 重新开启
            data: { page: that.page, pageSize: that.pageSize, proName: that.search,price:that && that.price,num:that && that.num },
            //发送请求之前触发的函数
            beforeSend:function () {
                //发送请求之前显示加载中
                $('.mask').show();
            },
            success: function(data) {
                // 由于success里面的逻辑代码不一样 但是他们请求代码都是一样 逻辑代码不一样就只能通过参数的回调函数来实现
                //2. 判断如果传递了callback就调用 同时因为data只有success里面有 调用回调函数的时候把data传给这个回调函数
                callback && callback(data);
                 // 请求渲染完毕后隐藏加载中效果
                 $('.mask').hide();
            }
        });
    },
    productBuy:function () {
        // 1. 给所有的购买按钮添加点击事件
        $('.productlist-content .mui-row').on('tap','.product-buy',function () {
            // 2. 获取当前点击按钮的id
            var id = $(this).data('id');
            // 3. 跳转到商品详情页面并且跟上商品id参数
            window.location.href = 'detail.html?id='+id;
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