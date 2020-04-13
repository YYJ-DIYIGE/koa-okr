import API from '../../models/api';
const app = getApp()
Page({
  data:{
    todoID:'',
    okrData:[],
    keyresultData:[],
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "Todo关联"
    })
    this.setData({
      todoID: options.id
    })
  },
  onShow(){
      let id = this.data.todoID;
      let that = this;
      let user_id = app.globalData.userInfo.id;
      wx.request({
        url: API.todo_keyesult + '/' + 'all' + '/' + id,
        data:{
          user_id
        },
        success: (res)=>{
         that.setData({
          okrData: res.data.okr,
         })
        },
      });
  },
  handleBind(e){
    let id = this.data.todoID;
    let krId = e.currentTarget.dataset.id;
    let thes = this;
    wx.showModal({
      title: '提示',
      content: '确定要关联这条KR吗',
      success: (res) => {
        if(res.confirm){
         wx.request({
           url: API.todo_keyesult + '/' + 'insert' + '/' + id,
           data:{
             todoId:id,
             krId
           },
           success(res){
             if(res.data.message === '绑定成功'){
              thes.onShow()
             }
           }
         })
        }
      }
    });
  },
  handleOff (e){
    let id = this.data.todoID;
    let krId = e.currentTarget.dataset.id;
    let thes = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消关联这条KR吗',
      success: (res) => {
        if(res.confirm){
          let script = `?todoId=${id}&krId=${krId}`
          wx.request({
            url: API.todo_keyesult + '/' + 'delete' + '/' + id + script,
            method: "DELETE",
            data:{
              todoId:id,
              krId
            },
            success(res){
              if(res.data.message === '取关成功'){
                console.log(res.data.message)
                thes.onShow()
              }
            }
          })
        }
      }
    })
  }
})