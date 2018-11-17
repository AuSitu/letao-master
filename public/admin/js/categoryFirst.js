$(function(){
    var letao = new Letao();
    letao.queryTopCategory();
    letao.addTopCategory();
    

});

var Letao = function(){

};

Letao.prototype = {
    page :1,
    totalPages:1,
    


    queryTopCategory: function () {

        var that = this;

        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                page: that.page,
                pageSize: 5,
            },
            success: function (obj) {
                // console.log(obj);
                var html = template('categoryFirstTpl', obj)
                // console.log(html);

                that.totalPages = Math.ceil(obj.total/ obj.size)
                // console.log(that.totalPages);
                
                $('.user-info tbody').html(html)

                that.initBootstrapPaginator();

            }
        })
    },

     // 添加一级分类功能
    addTopCategory: function(){
        var  that = this;
        $('.btn-save').on('click',function(){
            var categoryName = $('.category-name').val();
           

            if(!categoryName.trim()){
                alert('请输入分类名字');
                return
            }

            $.ajax({
                url:'/category/addTopCategory',
                type:'post',
                data:{categoryName:categoryName},
                success:function(obj){
                    // console.log(obj);
                    if(obj.success){
                        that.queryTopCategory();
                    }
                }
            })
            $('.category-name').val("");
        })
    },





    initBootstrapPaginator: function () {
        var that = this;

        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: that.totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                // console.log(event);
                // console.log(originalEvent);
                // console.log(type);
                

                that.page = page;
                that.queryTopCategory();
            }
        });

    },
}