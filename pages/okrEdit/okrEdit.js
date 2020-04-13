import API from '../../models/api';
Page({
  data:{
    objTxet: "",
    keyresults: [],
    krID: '',
    deleteId: []
  },
  onLoad: function(options){
    this.setData({
      krID: options.id
    })
  },
  onShow: function(){
    let that = this;
    let id = this.data.krID;
    wx.request({
      url: API.okr + '/' + 'editshow' + '/' + id,
      success: res =>{
        if(res.data.code === 200){
          that.setData({
            objTxet: res.data.objTxet,
            keyresults: res.data.keyresult
          })
        }
      }
    })
  },
  handleChangeObjective: function(e){
    let value = e.detail.value;
    this.setData({objTxet:value});
  },
  handleAddKeyresult: function(e){
    let keyresults = this.data.keyresults;
    keyresults.push({title:''})
    this.setData({keyresults});
  },
  handleChangeKeyresult:function(e){
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let keyresults = this.data.keyresults;
    keyresults[index].title = value;
    this.setData({keyresults});
  },
  handleDeleteKeyresult:function(e){
    let deleteId = this.data.deleteId;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let keyresults = this.data.keyresults;
    keyresults.splice(index,1);
    id ? deleteId.push(id) : false;
    this.setData({
      deleteId,
      keyresults
    })
  },
  handleSubmit:function(){
    let id = this.data.krID;
    let objective = this.data.objTxet;
    let keyresults = this.data.keyresults
    let deleteId = this.data.deleteId;
    if(!objective || !keyresults){
      wx.showToast({
        title: '目标和成果为必填项目',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    let tmp = keyresults.every( data => data.title);
    if(!tmp){
      wx.showToast({
        title: '所添加成果为必填',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    wx.request({
      url: API.okr + '/' + 'edit' + '/' + id,
      data:{
        objective,
        keyresults,
        deleteId
      },
      success: res =>{
        if(res.data.code === 200){
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
        }
      }
    })
  }
})