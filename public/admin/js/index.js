$(function () {
    var letao = new Letao();
    letao.queryUser();
    letao.updateUser();
})

var Letao = function () {

}

Letao.prototype = {
    
    page :1,
    totalPages:1,
    


    queryUser: function () {

        var that = this;

        $.ajax({
            url: '/user/queryUser',
            data: {
                page: that.page,
                pageSize: 5,
            },
            success: function (obj) {
                // console.log(obj);
                var html = template('userTpl', obj)
                // console.log(html);

                that.totalPages = Math.ceil(obj.total/ obj.size)
                // console.log(that.totalPages);
                
                $('.user-info tbody').html(html)

                that.initBootstrapPaginator();

            }
        })
    },

    updateUser: function () {
        var that = this;

        $('.user-info tbody').on('click', '.btn-option', function () {
            var isDelete = $(this).data('is-delete');
            isDelete = isDelete == 0 ? 1 : 0;
            // console.log(isDelete);
            $(this).data('is-delete', isDelete);
            var id = $(this).data('id');
            // console.log(id);

            $.ajax({
                url: '/user/updateUser',
                type: 'post',
                data: {
                    isDelete: isDelete,
                    id: id
                },
                success: function (obj) {
                    // console.log(obj);
                    if (obj.success) {
                        that.queryUser();
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
                that.queryUser();
            }
        });

    },
}