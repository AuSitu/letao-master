$(function() {

    var letao = new Letao();
    //调用初始化区域的方法
    letao.initScroll();
    //调用获取左侧分类的数据
    letao.getCategory();
    //调用获取右侧品牌的数据
    letao.getBrand();
    // 默认调用一次获取右侧品牌的数据 传参id为1
    letao.getBrandData(1);
})

var Letao = function() {

}

Letao.prototype = {
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
    //获取分类的数据
    getCategory: function() {
        // 1. 请求左侧分类的API接口
        $.ajax({
            //左侧分类的API  /表示网站根目录 我们网站根目录是localhost:3000
            //变成localhost:3000/category/queryTopCategory
            url:'/category/queryTopCategory',
            //发送请求之前触发的函数
            beforeSend:function () {
                //发送请求之前显示加载中
                $('.mask').show();
            },
            // type:'get'
            //dataType:'json
            success: function(data) {
                console.log(data);
                // 3. 调用模板引擎的方法生成模板
                var html = template('categoryTmp',data);
                // 4. 把生成的html放到左侧分类的ul里面
                $('.category-left ul').html(html);
                // 请求渲染完毕后隐藏加载中效果
                 $('.mask').hide();
            }
        });
    },
    //点击左侧分类 获取分类的品牌数据
    getBrand: function() {
        // getBrand是letao.getBrand 是letao调用的 this就指向letao
        var that = this;
       // 1. 给左侧分类添加点击事件 由于左侧分类动态 使用事件委托的方式加
        $('.category-left ul').on('tap','li a',function () {
            //在事件里面表示触发这个事件元素 因为事件就是使用元素添加的一个函数 
            //这个元素调用的这个事件的函数 this就是调用这个事件元素
            console.log(this);
            // 2. 获取当前点击的左侧分类的分类id
            var id = $(this).data('id');
            //原生js的方式获取自定义属性的值
            // this.dataset['id']
            //jquery和zepto的取自定义属性的值的方式  和 attr的区别 data('id')  attr('data-id')
            // $(this).data('id')
            // $(this).data('id',2)
            // 3. 根据这个id去请求右侧品牌的数据
            that.getBrandData(id);
            //6. 给当前的元素的父元素添加active 给其他删除active
            $(this).parent().addClass('active').siblings().removeClass('active');
        });
    },
    //获取品牌数据的函数
    getBrandData:function (id) {
        // 4. 调用ajax根据分类的id去获取品牌的数据
        $.ajax({
            url:'/category/querySecondCategory',
            data:{'id':id},//这个API需要传参数
            //发送请求之前触发的函数
            beforeSend:function () {
                //发送请求之前显示加载中
                $('.mask').show();
            },
            success:function (data) {
                // 5. 调用模板刷新右侧品牌的数据
                var html = template('brandTmp',data);
                // 6. 把生成的模板放到右侧的品牌的mui-row容器里面
                $('.category-right .mui-row').html(html);
                // 请求渲染完毕后隐藏加载中效果
                 $('.mask').hide();
            }
        })
    }
}
