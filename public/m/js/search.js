$(function(){
    var letao = new Letao();
    
    letao.addHistory();
    letao.queryHistory();
    letao.deleteHistory();
    letao.clearHistory();
});


var Letao = function(){

}

Letao.prototype = {
    // 1. 添加搜索记录
    addHistory: function(){

        var that = this;

        $('.btn-search').on('tap',function(){
            var search = $('.input-search').val();
            // console.log(search);

            if(search.trim() == ''){
                alert('请输入你要搜索的商品')
                return;
            }

            // 获取本地存储中已经存储的数据  并且转成一个数组 
            var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            // console.log(historyData);


            // console.log(historyData.indexOf(search));
            
            if(historyData.indexOf(search) != -1){
                historyData.splice(historyData.indexOf(search),1);
            }

            historyData.unshift(search);
            
            localStorage.setItem('historyData',JSON.stringify(historyData));

            that.queryHistory();
            
            $('.input-search').val('');
            console.log(location);

            location.href ='productlist.html?search=' +  search;
            



            
        })
    },

    // 2. 查询搜索记录
    queryHistory:function(){
        var historyData = JSON.parse(localStorage.getItem('historyData')) || [];

        var html = template('historyListTmp',{'rows':historyData});
      
        // console.log(html);
        
        $('.content ul').html(html);
     
    },

    // 3. 删除搜索记录
    deleteHistory:function(){
        console.log(this);
        
        var that = this;

        $('.content ul').on('tap','.fa-close',function(){
            var index = $(this).data('index');
            // console.log(index);

            var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
          
            

            historyData.splice(index,1);

            localStorage.setItem('historyData',JSON.stringify(historyData));

            console.log(historyData);

            that.queryHistory();
            
        })
    },

    // 4. 清空搜索记录
    clearHistory:function(){
        var that = this;
        $('.btn-clear').on('tap',function(){
            localStorage.removeItem('historyData');

            that.queryHistory();
        })
    }

}