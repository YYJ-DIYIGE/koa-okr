import API from "../../models/api";
Page({
  data:{
    value:"",
    todo:[]
  },
  onShow: function(){
    let that = this;
    let id = wx.getStorageSync('userInfo').id;
    wx.request({
      url: API.todo,
      data:{
        user_id: id
      },
      success: res =>{
        if(res.data.code === 200){
          let todos = res.data.todo.filter(data => data.status == 0)
          that.setData({
            todo: todos
          })
        }
      }
    })
  },
  handleChange:function(event){
    let value = event.detail.value;
    this.setData({value});
  },
  addtodos:function(event){
    let that = this;
    let value = this.data.value;
    wx.request({
      url: API.todo + '/' +'insert',
      method: 'GET',
      data: {
        title: value,
        status: 0,
        user_id: 1
      },
      success: res => {
        that.onShow();
      },
    })
    this.setData({
      value:''
    })
  },
  operation:function(e){
    let than = this;
    let id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList:["关联","完成","删除"],
        success(res){
          console.log(res.tapIndex)
          switch (res.tapIndex){
            case 0:
              than.handleRelation(id)
              break;
            case 1:
              than.handleState(id)
              break;
            case 2:
              than.handleDelete(id)
          }
        }
    })
  },
  handleRelation: function(id){
    wx.navigateTo({
      url: `../todo_keyresult/todo_keyresult?id=${id}`
    })
  },
  handleState: function(id){
    let that = this;
    let finished_time = new Date();
    wx.request({
     url: API.todo + '/' +'update'+'/'+ id,
     method: 'GET',
     data: {
       status: 1,
       finished_time,
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
      data: {
        id
      },
      success: res => {
        that.onShow()
      }
    })
  }
})
