const User = require('../models/user');
const config = require('../config');
const axios = require('axios');
const authController  = {
  login: async (ctx, next) => {
    let appId = config.miniapp.appid;
    let secret = config.miniapp.secret;
    let js_code = ctx.query.code;
    let name = JSON.parse(ctx.query.userInfo).nickName;
    if(!js_code){
      ctx.state.data = { message: '缺少 code 参数'}
      return
    }
    try{
      let data = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`);
      let openid = data.data.openid;
      if(!openid){
        ctx.body =({
          code:0,
          message: '服务器错误11'
        })
        return
      }
      if(openid.length !== 28){
        ctx.body =({
          code:0,
          message: '服务器错误'
        })
        return
      }
      
      let userInfo = await User.select({open_id:openid})
      let id = userInfo[0].id;
      if(openid === userInfo[0].open_id){
        ctx.body = ({
          code:200,
          message: '已有此用户，登录成功',
          userInfo:{name:name,id:id}
        })
        return
      }
      await User.insert({name, open_id: openid})
        ctx.body = ({
          code:200,
          message: '添加用户成功，登录成功',
          userInfo:{name:name,id:id}
        })
    }catch(err){
      ctx.body = ({
        code: 0,
        message: '服务器错误22'
      })
    }
  }
}
module.exports = authController;