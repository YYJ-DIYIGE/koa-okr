import API from '../../models/api';
Page({
  data:{
    okrArr:[],
    krdata:[],
    status: '',
    id: ''
  },
  onLoad: function(options){
    console.log(options.id)
    this.setData({id:options.id})
  },
  onShow: function(){
    let that = this;
    let id = this.data.id;
    wx.request({
      url: API.okr + '/' + 'detall' + '/' + id,
      success: res =>{
        if(res.data.code === 200){
          that.setData({
            okrArr: res.data.objective,
            krdata: res.data.krdata
          })
        }
      }
    })
  },
  operation: function(e){
    let kystatus = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id
    this.setData({status:kystatus})
    let that =this
    let status = kystatus ? "标记未完成" : "标记已完成"
    wx.showActionSheet({
      itemList:[status,"删除"],
      success(res){
        switch(res.tapIndex){
          case 0:
            that.updateStaues(id)
            break;
          case 1:
            that.deleteky(id)
            break;
        }
      }
    })
  },
  updateStaues: function(id){
    let status = this.data.status;
    let that = this
    wx.request({
      url: API.okr + '/' + 'detall' + '/' + 'update' + '/' + id,
      data:{
        status
      },
      success:(res)=>{
        if (res.data.code == 200) {
          that.onShow()
          wx.showToast({
            title: '标记成功',
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      }
    })
  },
  deleteky:function(id){
    let that = this
    wx.request({
      url: API.okr + '/' + 'detall' + '/' + 'delete' + '/' + id,
      method: "DELETE",
      success:(res)=>{
        if (res.data.code == 200) {
          that.onShow()
          wx.showToast({
            title: '已删除',
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      }
    })
  }
})