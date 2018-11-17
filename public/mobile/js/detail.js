$(function() {
    var letao = new Letao();
    //调用初始化区域滚动
    letao.initScroll();
    //1. 获取当前商品的id根据地址栏参数获取
    letao.id = letao.getQueryString('id');
    //2. 调用获取商品详情的方法 传入当前的商品id
    letao.getProductDetail();
    //调用加入购物车
    letao.addCart();
})

var Letao = function() {

}

Letao.prototype = {
    //初始化轮播图的方法
    initSlide: function() {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    //初始化区域滚动
    initScroll: function() {
        //获取区域滚动的父容器调用初始化方法  里面可以传一些配置参数
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: true, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });
    },
    //获取商品详情数据
    getProductDetail: function() {
        var that = this;
        // 3. 发送ajax请求商品详情数据
        $.ajax({
            url: '/product/queryProductDetail',
            data: { id: that.id },
            success: function(data) {
                //4. 调用轮播图模板生成轮播图
                var slideHtml = template('slideTmp', data);
                //5. 把生成的html模板放到我们的轮播图区域容器里面
                $('#slide').html(slideHtml);
                //6. 要在轮播图结构出来后再调用初始化轮播图的方法
                that.initSlide();
                // 7. 把尺码先处理成数组
                var min = data.size.split('-')[0];
                var max = data.size.split('-')[1];
                var sizeArr = [];
                // 8. 循环从最小开始到最大
                for (var i = min; i <= max; i++) {
                    // 9. 往数组中添加每一个尺码
                    sizeArr.push(parseInt(i));
                }
                // 10. 把数组原理的40-50替换我们的sizeArr
                data.size = sizeArr;
                // 11. 调用商品信息的模板生成html
                var html = template('productInfoTmp', data);
                // 12. 把生成的html渲染到商品容器里面
                $('.product').html(html);
                // 13. 默认数字框也动态生成也无法点击（在渲染完后再初始化数字框）
                mui('.mui-numbox').numbox();
                // 14. 让尺码支持点击
                $('.btn-size').on('tap', function() {
                    // 15. 给当前点击的尺码按钮添加active其他的删除
                    $(this).addClass('active').siblings().removeClass('active');
                });
            }
        })
    },
    //加入购车功能
    addCart: function() {
        var that = this;
        // 1. 给加入购物车按钮添加点击事件
        $('.btn-add-cart').on('tap', function() {
            // 2. 获取当前选择的尺码和数量  获取值都尽量通过属性
            var size = $('.btn-size.active').data('size');
            // 3. 判断如果尺码没有选择就提示请选择尺码
            if (!size) {
                // 第一次参数就是提示的内容 duration:1000 可以写毫秒数 也可以单词  long short
                mui.toast('请选择尺码', { duration: 2000, type: 'div' });
                //注意要return 后面代码不执行
                return;
            }
            // 4. 获取当前选择的数量 使用MUI提供的方法来获取数字框的值
            var num = mui('.mui-numbox').numbox().getValue();
            if (!num) {
                mui.toast('请选择数量', { duration: 2000, type: 'div' });
                return;
            }
            // 5. 调用添加购物车的API实现添加购物车           
            $.ajax({
                type: 'post', //如果请求是POST需要设置type
                url: '/cart/addCart',
                data: { productId: that.id, size: size, num: num },
                success: function(data) {
                    // 6. 判断如果data返回的值 有error表示有错 有错就跳转到登录有错都是没登录
                    if (data.error) {
                        //详情页面跳转到登录 让登录完成后回到我的当前的详情页
                        location.href = 'login.html?returnUrl=detail.html?id=' + that.id;
                    } else {
                        //添加购物车成功
                        // 7. 弹出一个确认框问用户是否要去购物车查看
                        //使用MUI的组件消息框 》 确认框
                        // 第一个参数是提示内容 第二个提示标题 第三个 按钮的值（值是数组） 回调函数
                        mui.confirm('添加购物车成功是否要去购物车查看？', '温馨提示', ['yes', 'no'], function(e) {
                            // 8. 判断当前点击了是还是否
                            if (e.index == 0) {
                                //9. 表示点击了是 点击了yes
                                // 10.跳转到购车查看
                                location.href = 'cart.html';
                            } else if (e.index == 1) {
                                //10. 表示点击了否  no
                                mui.toast('请充值您的余额已不足？ 充值后继续购买', { duration: 2000, type: 'div' });
                            }
                        });
                    }
                }
            })
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
