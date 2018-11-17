$(function() {
    var letao = new Letao();
    //调用乐淘后台的获取一级分类的函数
    letao.queryCategory();
    //调用添加分类的的函数
    letao.addCategory();
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
    queryCategory: function() {
        var that = this;
        // 1. 请求一级分类的APi
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: { page: that.page, pageSize: that.pageSize },
            success: function(data) {
                console.log(data);
                // 2. 判断返回的数据是否有错
                if (data.error) {
                    // 3. 如果查询失败表示未登录
                    location.href = 'login.html';
                } else {
                    // 4. 调用模板生成html
                    var html = template('categoryTmp', data);
                    // 5. 把模板放到表格的tbody
                    $('.category-manage tbody').html(html);
                    //6. 计算 总页数  为 总条数/ 每页大小 向上取整
                    that.totalPages = Math.ceil(data.total /  that.pageSize)
                    //7. 调用分类的初始化函数
                    that.initPage();
                }
            }
        })
    },
    //添加分类的函数
    addCategory: function() {
        var that = this;
        // 1. 给保存按钮添加点击事件
        $('.btn-save').on('click', function() {
            // 2. 获取当前输入的分类的名称
            var categoryName = $('.category-name').val();
            $('.category-name').val("");
            if(!categoryName.trim()){
                alert('请输入分类名称');
                //要使用return false阻止事件的默认行为 （默认把模态框关闭）
                return false;
            }
            // 3. 调用添加分类的API实现添加分类
            $.ajax({
                type: 'post',
                url: '/category/addTopCategory',
                data: { categoryName: categoryName },
                success: function(data) {
                    // 4. 判断如果添加成功重新查询刷新数据
                    if (data.success) {
                        // 5. 调用查询刷新页面
                        that.queryCategory();

                    } else {
                        // 6. 失败就跳转到登录
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
