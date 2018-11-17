$(function() {
    var letao = new Letao();
    //调用初始化轮播图的方法
    letao.initSlide();
    //调用初始化区域的方法
    letao.initScroll();
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
    }
}
