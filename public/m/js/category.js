$(function () {
    var letao = new Letao();

    letao.initLeftScroll();
    letao.initRightScroll();

    letao.queryTopCategory();

    letao.querySecondCategory();
})


// Letao的构造函数
var Letao = function () {

};

Letao.prototype = {

    //初始化分类左侧区域滚动的函数
    initLeftScroll: function () {
        mui('.category-left .mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },

    //初始化分类右侧区域滚动的函数
    initRightScroll: function () {
        mui('.category-right .mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    },

    //获取一级分类数据的函数
    queryTopCategory: function () {
        $.ajax({
            url: "/category/queryTopCategory",

            beforeSend: function () {
                $('.mask').show();
            },

            complete: function () {
                $('.mask').hide();

            },
            success: function (data) {
                // console.log(data);

                var html = template('firstCategoryTpl', data);
                // console.log(html);

                $('.category-left ul').html(html)


            }
        });
    },

    //获取二级分类的函数
    querySecondCategory: function () {
        $('.category-left ul').on('tap', 'li a', function () {
            // console.log(this);
            // var id = this.dataset['id'];
            // var id= this.getAttribute('data-id');
            var id = $(this).data('id');
            // console.log(id);

            $(this).parent().addClass('active').siblings().removeClass('active');

            $.ajax({
                url: '/category/querySecondCategory',
                data: {
                    id: id
                },
                beforeSend: function () {
                    $('.mask').show();
                },
    
                complete: function () {
                    $('.mask').hide();
    
                },
                success: function (data) {
                    // console.log(data);

                    var html = template('secondCategoryTp1', data);
                    // console.log(html);

                    $('.category-right .mui-row').html(html);

                }
            });




        })
    },




}