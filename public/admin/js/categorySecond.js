$(function(){
    var letao = new Letao();
    letao.queryTopCategory();
    letao.addSecondCategory();
    letao.exit();

})

var Letao = function(){

}

Letao.prototype = {
    page :1,
    totalPages:1,
    


    queryTopCategory: function () {

        var that = this;

        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: {
                page: that.page,
                pageSize: 5,
            },
            success: function (obj) {
                console.log(obj);
                var html = template('categorySecondTpl', obj)
                // console.log(html);

                that.totalPages = Math.ceil(obj.total/ obj.size)
                // console.log(that.totalPages);
                
                $('.user-info tbody').html(html)

                that.initBootstrapPaginator();

            }
        })
    },

    addSecondCategory:function(){

        var that = this;
        $('.btn-add-brand').on('click',function(){

            $.ajax({
                url: '/category/queryTopCategoryPaging',
                data :{page:1,pageSize:99},
                success:function(obj){

                    var html ='';
                    for(var i=0;i<obj.rows.length;i++){
                        html += '<option value="'+obj.rows[i].id+ '">' + obj.rows[i].categoryName+ '</option>';
                    }
                    $('.select-category').html(html);

                }
            });
            $('.select-img').on('change',function(){
                var baseUrl = '/mobile/images/';
                var file =this.files[0];
                var imgSrc = baseUrl +file.name;
                // console.log(imgSrc);
                $('.img-file').attr('src',imgSrc);
            })

        })

        $('.btn-save').on('click',function(){
            // var categoryId = $('.select-category').val();

            var categoryId = $('.select-category option:selected').val();
            // console.log(categoryId);
            var brandName = $('.brand-name').val();
            // console.log(brandName);
            var brandLogo = $('.img-file').attr('src');
            console.log(brandLogo);
            $.ajax({
                url:'/category/addSecondCategory',
                type:'post',
                data:{
                    brandName:brandName,
                    categoryId:categoryId,
                    brandLogo:brandLogo,
                    hot:1
                },
                success:function(obj){
                    if(obj.success){
                        that.queryTopCategory();
                    }
                    
                }
            })
            
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


    exit: function() {
        $('.btn-exit').on('click', function() {
            $.ajax({
                url: '/employee/employeeLogout',
                success: function(data) {
                    if(data.success){
                        location.href = 'login.html';
                    }
                }
            })
        });
    }
}