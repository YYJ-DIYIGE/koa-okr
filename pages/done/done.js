import API from '../../models/api';
const app = getApp()
Page({
  data:{
    index: 1,
    done:[]
  },
  onShow: function(){
    let that = this;
    let id = app.globalData.userInfo.id;
    wx.request({
      url: API.todo,
      data:{
        user_id: id
      },
      success: res =>{
        if(res.data.code === 200){
          let todos = res.data.todo.filter(data => data.status == 1)
          that.setData({
            done: todos
          })
        }
      }
    })
  },
  operation:function(e){
    let than = this;
    let id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList:["标记未完成","删除"],
      success(res){
        switch (res.tapIndex){
          case 0:
            than.handleState(id)
            break;
          case 1:
            than.handleDelete(id)
            break;
        }
      }
    })
  },
  handleState: function(id){
    let that = this;
    wx.request({
     url: API.todo + '/' +'update'+'/'+ id,
     method: 'GET',
     data: {
       status: 0
     },
     success: res => {
       that.onShow();
     },
   })
  },
  handleDelete: function(id){
    let that = this;
    wx.request({
      url: API.todo + '/' + 'delete' + '/' +id,
      method: 'DELETE',
      success: res => {
        that.onShow()
      }
    })
  }
})