import API from '../../models/api';
const app = getApp()
Page({
  data:{
    objective:[],
    state:''
  },
  onLoad: function(){
    this.onShow();
  },
  onShow: function(){
    let that = this;
    let user_id = app.globalData.userInfo.id;
    wx.request({
      url: API.okr,
      success: res => {
        if(res.data.code === 200){
          let objective = res.data.objective.filter(data => {
            return data.user_id === user_id
          })
          that.setData({
            objective: objective
          })
        }
      }
    })
  },
  operation:function(e){
    let id = e.currentTarget.dataset.id;
    let that = this;
    let state=  e.currentTarget.dataset.state;
    that.setData({
      state: state
    })
    let status = state ? "标记未完成" : "标记已完成";
    wx.showActionSheet({
      itemList:["查看","编辑",status,"删除"],
      success(res){
        switch(res.tapIndex){
          case 0:
            wx.navigateTo({
              url: `../okrDetall/okrDetall?id=${id}`
            })
            break;
          case 1:
            wx.navigateTo({
              url: `../okrEdit/okrEdit?id=${id}`
            })
            break;
          case 2:
            that.updateStaues(id)
            break;
          case 3:
            that.deleteOkr(id)
            break;
        }
      },
    })
  },
  updateStaues:function(id){
    let that = this;
    let state = that.data.state;
    let script = `?state=${state}`
    wx.request({
      url: API.okr + '/' + 'update' + '/' + id + script,
      success(res){
        if(res.data.code == 200){
          console.log("修改成功")
          that.onShow()
        }
      }
    })
  },
  deleteOkr:function(id){
   let that = this;
   wx.request({
     url: API.okr + '/' + 'delete' + '/' + id,
     method: "DELETE",
     success(res){
       if(res.data.code == 200){
        console.log("删除成功")
        that.onShow()
       }
     }
   })
  }
})