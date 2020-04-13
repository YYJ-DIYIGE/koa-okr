import API from '../../models/api';
const app = getApp()
Page({
  data:{
    objective:"",
    keyresults: [{
      title: ''
    }],
  },
  handleChangeObjective: function(e){
    let value = e.detail.value;
    this.setData({objective:value});
  },
  handleChangeKeyresult:function(e){
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let keyresults = this.data.keyresults;
    keyresults[index].title = value;
    this.setData({keyresults})
  },
  handleAddKeyresult:function(e){
    let keyresults = this.data.keyresults;
    keyresults.push({title:''})
    this.setData({keyresults});
  },
  handleDeleteKeyresult:function(e){
    let index = e.currentTarget.dataset.index;
    let keyresults = this.data.keyresults;
    keyresults.splice(index,1);
    this.setData({keyresults})
  },
  handleSubmit:function(){
    let user_id = app.globalData.userInfo.id;
    let keyresults = this.data.keyresults;
    let objective = this.data.objective;
    let that = this;
    if(!keyresults || !objective){
      wx.showToast({
        title: '目标和成果为必填项目',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    wx.request({
      url: API.okr + '/' + 'create',
      data: {
        keyresults,
        objective,
        user_id
      },
      method: 'GET',
      success: (res)=>{
        if(res.data.code === 200){   
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000,
            mask: true,
          })
          setTimeout(()=>{
            wx.switchTab({url: "/pages/okr/okr"})
          },1000)
        }
      },
    });
  }
})