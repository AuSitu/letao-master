$(function() {
    var letao = new Letao();
    //调用乐淘后台的获取一级分类的函数
    letao.queryBrand();
    //调用添加分类的的函数
    letao.addBrand();
    //调用退出登录函数
    letao.exit();
});

var Letao = function() {

}

Letao.prototype = {
    //当前页码数
    page: 1,
    //每页大小
    pageSize: 10,
    //总页数
    totalPages: 0,
    //查询品牌的函数
    queryBrand: function() {
        var that = this;
        // 1. 调用查询品牌的API 
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            data: { page: that.page, pageSize: that.pageSize },
            success: function(data) {
                // 2. 判断返回的数据是否有错
                if (data.error) {
                    // 3. 表示未登录 跳转到登录
                    location.href = 'login.html';
                } else {
                    // 4. 成功就调用模板生成html
                    var html = template('brandTmp', data);
                    // 5. 把生成的html渲染到表格tbody里面
                    $('.brand-manage tbody').html(html);
                }
            }
        })
    },
    //添加品牌的函数
    addBrand: function() {
        var that = this;
        // 1. 给添加品牌添加点击事件
        $('.btn-add-brand').on('click', function() {
            // 2. 调用获取一级分类的APi
            $.ajax({
                url: '/category/queryTopCategoryPaging',
                data: { page: 1, pageSize: 50 },
                success: function(data) {
                    // 3. 判断如果报错
                    if (data.error) {
                        //4. 去登录
                        location.href = 'login.html'
                    } else {
                        // 5. 调用生成option的模板 
                        var html = template('categoryNameTmp',data);
                        // 6. 把option添加到下拉框
                        $('#selectCategory').html(html);
                    }
                }
            })
        });
        // 2. 给选择图片的输入添加选择事件
        $('.select-file').on('change',function (e) {
            // 3. 不获取图片路径 这个路径假的路径不是真的
            var fileName = e.currentTarget.files[0].name || '';
            // 4. 拼接固定的图片路径
            var imgSrc = '/mobile/images/'+fileName;
            // 5. 把图片路径设置到input下面的img的src
            $(this).siblings().attr('src',imgSrc);            
        });
        // 1.给保存按钮添加点击事件
        $('.btn-save').on('click',function () {
           // 1. 获取选择的分类的id  下拉框的value就是选中的option的value
           var categoryId = $('#selectCategory').val();
           // 2. 获取当前输入品牌名称
           var brandName = $('.brand-name').val();
           // 3. 获取当前选择图片的路径
           var brandLogo = $('.file-img').attr('src');
           // 4. 调用添加品牌的API实现添加品牌
           $.ajax({
                url:'/category/addSecondCategory',
                type:'post',
                data:{categoryId:categoryId,brandName:brandName,brandLogo:brandLogo,hot:1},
                success:function (data) {
                    // 5. 判断如果添加成功
                    if(data.success){
                        //成功就查询品牌
                        that.queryBrand();
                    }else{
                        // 6.失败就跳转到登录
                        location.href = 'login.html';
                    }
                }
           })
        });
    },
    //初始化分页插件
    initPage: function() {
        var that = this;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: 5, //有几个页面的按钮
            totalPages: that.totalPages, //总页数  总数据条数 / 每页大小 向上取整
            shouldShowPage: true, //是否显示首页尾页等按钮
            useBootstrapTooltip: true, //是否加载提示工具插件
            //点击事件
            onPageClicked: function(event, originalEvent, type, page) {
                //获取当前点击的页面数 更新letao对象里面全局页码数
                that.page = page;
                //查询当前页码数的一级分类列表
                that.queryCategory();
            }
        });
    },
    //退出登录函数
    exit: function() {
        // 1. 给退出按钮添加点击事件
        $('.btn-exit').on('click', function() {
            // 2.调用退出登录的APi实现退出
            $.ajax({
                url: '/employee/employeeLogout',
                success: function(data) {
                    // 3. 判断如果退出成功跳转到登录
                    if (data.success) {
                        location.href = 'login.html';
                    }
                }
            })
        });
    }
}
