$(function() {
    var letao = new Letao();
    //调用乐淘后台的获取用户信息的方法
    letao.queryUser();
    //调用更改用户状态的方法
    letao.updateUser();
    //调用退出登录的函数
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
    queryUser: function() {
        var that = this;
        // 1. 调用ajax请求获取用户信息APi
        $.ajax({
            url: '/user/queryUser',
            data: { page: that.page, pageSize: that.pageSize },
            success: function(data) {
                // 2. 判断如果data.error
                if (data.error) {
                    // 3. 表示未登录
                    location.href = 'login.html';
                } else {
                    // 4. 调用模板生成html
                    var html = template('userTmp', data);
                    // 5. 把html放到表格的tbody里面
                    $('.user-manage tbody').html(html);
                    // 6. 计算当前的总分页页数 给全局变量赋值
                    that.totalPages = Math.ceil(data.total / that.pageSize);
                    //7. 初始化分页插件 等总页数计算出来了才初始化
                    that.initPage();
                }
            }
        })
    },
    //更改用户的状态
    updateUser: function() {
        var that = this;
        // 1. 给禁用和启用的按钮添加点击事件
        $('.user-manage tbody').on('click', '.btn-option', function() {
            // 2. 获取当前点击按钮的状态
            var isDelete = $(this).parent().data('is-delete');
            //如果isDelete的值为0 变成 1  如果为1 变成 0 
            isDelete = isDelete == 0 ? 1 : 0;
            // 3. 获取当前点击按钮的用户的id
            var id = $(this).parent().data('id');
            // 4. 调用更改用户状态的API
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: { id: id, isDelete: isDelete },
                success: function(data) {
                    // 5. 判断如果更新失败表示未登录
                    if (data.error) {
                        // 6. 跳转到登录
                        location.href = 'login.html'
                    } else {
                        // 7. 更新成功 刷新页面
                        that.queryUser();
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
                //改变当前页面数就重新调用API查询
                that.queryUser();
            }
        });
    },
    //退出登录函数
    exit:function() {
        // 1. 给退出按钮添加点击事件
        $('.btn-exit').on('click',function () {
           // 2.调用退出登录的APi实现退出
           $.ajax({
                url:'/employee/employeeLogout',
                success:function (data) {
                    // 3. 判断如果退出成功跳转到登录
                    if(data.success){
                        location.href = 'login.html';
                    }
                }
           }) 
        });
    }
}
