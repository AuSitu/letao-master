$(function () {
    var letao = new Letao();

    letao.queryProductDetail();
    letao.addCart();
});

var Letao = function () {

};

Letao.prototype = {

    queryProductDetail: function () {
        this.productId = this.getQueryString('productId');
        console.log(this.productId);

        // 发送请求
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: this.productId
            },
            beforeSend: function() {
                // 把遮罩层显示出来
                $('.mask').show();
            },
            //发送请求完毕后去隐藏遮罩层
            complete: function() {
                // 把遮罩层显示出来
                $('.mask').hide();
            },
            success: function (obj) {
                console.log(obj);

                var sliderHtml = template('detailSliderTpl', obj);
                $('#slider').html(sliderHtml);


                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 500 //自动轮播周期，若为0则不自动播放，默认为0；
                });
                
                var size = [];
                for (var i = obj.size.split('-')[0];i<= obj.size.split('-')[1] ; i++){
                    // size.push(i);
                    size.push(parseInt(i))
                }
                obj.size = size ;
                // console.log(obj.size);
                var infoHtml = template('detailInfoTpl',obj);
                $('#product-info').html(infoHtml);

                mui('.mui-numbox').numbox();

                //初始化区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });

                $('.btn-size').on('tap',function(){
                    // console.log(this);
                    $(this).addClass('active').siblings().removeClass('active');
                    
                })
            }
        });
    },

     //加入购物车功能
     addCart: function(){

        var that = this;

        $('.btn-add-cart').on('tap',function(){
            var size =$('.btn-size.active').data('size');
            // console.log(size);
            // 没有选择是undefined
            if( !size ) {
                mui.toast('请选择您的尺码',{ duration:'short', type:'div' }) 
                return;
            }

            var currtNum = mui('.mui-numbox').numbox().getValue();
            // console.log(currtNum);
            if (!currtNum){
                mui.toast('请选择数量',{ duration:'short', type:'div' }) 
                return;
            }

            $.ajax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:that.productId,
                    size:size,
                    num:currtNum,
                },
                success:function(obj){
                    console.log(obj);
                    // console.log(obj.error);
                    // console.log(typeof(obj.error));

                    if(obj.error){
                        location.href= 'login.html?returnUrl=' + location.href;
                    }else{
                        mui.confirm('加入成功,是否要跳到购物车', '温馨提示', ['是','否'], function(e){
                            if(e.index == 0 ){
                                location.href = 'cart.html'   
                            }else {
                                mui.toast('请继续选购',{ duration:'short', type:'div' }) 

                            }      

                        } )
                    }
                }
            });
            
        })
     },





    //自己写的一个根据地址栏指定参数的名称获取参数值 
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
}