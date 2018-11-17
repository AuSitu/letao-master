// 产品列表的js

$(function () {
    var letao = new Letao();

    letao.urlQueryProductList();
    letao.searchProductList();
    letao.sortProductList();
    letao.pullDownUpRefresh();
});

var Letao = function () {

};

Letao.prototype = {
    //根据url搜索商品列表功能
    urlQueryProductList: function () {
        // console.log(location.search.split('=')[1]);
        // console.log( decodeURI(location.search.split('=')[1])  );
        // console.log(this);
        this.proName = this.getQueryString('search');
        // console.log(this.proName);

        // if ( !this.proName.trim() ){
        //     alert('请输入要搜索的商品');
        //     return;
        // }

        $.ajax({
            url: '/product/queryProduct',
            data: {
                proName: this.proName,
                page: 1,
                pageSize: 2,
            },

            beforeSend: function() {
                // 把遮罩层显示出来
                $('.mask').show();
            },
            //发送请求完毕后去隐藏遮罩层
            complete: function() {
                // 把遮罩层显示出来
                $('.mask').hide();
            },
            
            success: function (obj) {
                // console.log(obj);

                var html = template('productlistTmp', obj)
                // console.log(html);
                $('.content .mui-row').html(html)
            }
        });
    },


    //点击搜索商品列表功能
    searchProductList: function () {
        // console.log(this);
        var that = this;

        $('.btn-search').on('tap', function () {
            that.proName = $('.input-search').val();
            console.log(that.proName);


            if (!that.proName.trim()) {
                alert('请输入要搜索的商品');
                return;
            }

            $.ajax({
                url: '/product/queryProduct',
                data: {
                    proName: that.proName,
                    page: 1,
                    pageSize: 2,
                },
                success: function (obj) {
                    // console.log(obj);

                    var html = template('productlistTmp', obj)
                    // console.log(html);
                    $('.content .mui-row').html(html)
                }
            });

            $('.input-search').val("");

        })
    },


    //商品的排序功能
    sortProductList: function () {
        // console.log(this);

        var that = this;

        $('.title a').on('tap', function () {
            var sortType = $(this).data('sort-type');
            // console.log(sortType);
            var sort = $(this).data('sort');
            // console.log(sort);


            if (sort == 1) {
                sort = 2;
                $(this).children('i').removeClass().addClass('fa fa-angle-up');
            } else {
                sort = 1;
                $(this).children('i').removeClass().addClass('fa fa-angle-down');

            }

            //改变后要设置回到页面上
            $(this).data('sort', sort)

            if (sortType == 'price') {
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        proName: that.proName,
                        page: 1,
                        pageSize: 2,
                        price: sort,
                    },
                    success: function (obj) {
                        // console.log(obj);

                        var html = template('productlistTmp', obj)
                        // console.log(html);
                        $('.content .mui-row').html(html)
                    }
                });
            } else if (sortType == 'num') {
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        proName: that.proName,
                        page: 1,
                        pageSize: 2,
                        num: sort,
                    },
                    success: function (obj) {
                        // console.log(obj);

                        var html = template('productlistTmp', obj)
                        // console.log(html);
                        $('.content .mui-row').html(html)
                    }
                });
            }

        })

    },


    // 下拉刷新上拉加载搜索商品功能
    pullDownUpRefresh: function () {

        var that = this;

        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    contentdown : "速度下拉刷新☺",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover : "松手吧就可以刷新 ☺",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh : "正在刷新中 稍等...☺√",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh : "正在玩命加油加载中",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore:'已经没有数据了,(灬ꈍ ꈍ灬)',//可选，请求完毕若没有更多数据时显示的提醒内容；
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
                    url: '/product/queryProduct',
                    data: {
                        proName: that.proName,
                        page: 1,
                        pageSize: 2,
                    },
                    success: function (obj) {
                        // console.log(obj);


                        var html = template('productlistTmp', obj)
                        // console.log(html);
                        $('.content .mui-row').html(html)

                        //当页面刷新完成结束下拉刷新效果 不结束会一直转
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                        //除了需要下拉刷新还要重置上拉加载
                        mui('#pullrefresh').pullRefresh().refresh(true);

                        page = 1;

                    }
                });

            }, 1000);
        }

        /**
         * 上拉加载具体业务实现
         */

        var page = 1;

        function pullupRefresh() {
            setTimeout(function () {
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        proName: that.proName,
                        page: ++page,
                        pageSize: 2,
                    },
                    success: function (obj) {
                        // console.log(obj);


                        console.log(obj.data.length);
                        if (obj.data.length > 0) {

                            var html = template('productlistTmp', obj);
                            // console.log(html);
                            $('.content .mui-row').append(html);
                            //当页面刷新完成结束上拉加载效果 不结束会一直转
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();

                        } else {
                            //如果传入一个参数true表示上拉加载到底了没有更多数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

                        }
                    }
                });

            }, 1000);
        }

    },

    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },

}