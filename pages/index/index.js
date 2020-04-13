import API from '../../models/api';
const app = getApp();
Page({
  onLoad: function(){
    let userInfo = wx.getStorageSync('userInfo');//获取本地缓存数据
    if(userInfo){
      app.globalData.userInfo = userInfo;
      wx.switchTab({
        url: '/pages/todos/todo',
      })
    }
  },
  login: function(e) {
    let userInfo = e.detail.userInfo;
    wx.login({
      success: res => {
        if(res.code) {
          wx.request({
            url: API.login,
            method: "GET",
            data: {
              code: res.code,
              userInfo
            },
            success: res => {
              if(res.data.code === 200){
                let info = res.data.userInfo;
                wx.setStorageSync('userInfo', info); //本地缓存
                app.globalData.userInfo = info;
                wx.switchTab({
                  url: '/pages/todos/todo',
                })
              }
            }
          })
        }else{
          console.log('登录失败' + res.errMsg)
        }
      }
    })
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  }
})
