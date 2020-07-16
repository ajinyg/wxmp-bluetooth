Component({
    data:{
      mask:false
    },
    methods:{
      hide(){
        let _this = this;
        this.setData({mask:false},function(){
          _this.triggerEvent('onSendHide')
        });
      },
      show(){
        this.setData({mask:true});
      }
    }
});