const Todos = require('./../models/todos');
const {formatTime} = require('./../utils/date');

const todoController = {
  all: async (ctx, next) => {
    try{
      let user_id = ctx.query.user_id;
      let todoes = await Todos.where({user_id})
      let todo = todoes.map(data => {
        data.created_time = formatTime(data.created_time);
        if(data.finished_time) {
          data.finished_time = formatTime(data.finished_time);
        }
        return data
      })
      ctx.body = ({
        code: 200,
        todo
      })
    }catch(err){
      console.log(err)
      ctx.body = ({
        code: 0,
        message: '服务器错误'
      })
    }
  },
  update: async function(ctx, next) {
    let id = ctx.params.id;
    let params = ctx.query;
    params.finished_time = params.status ? new Date() : null;
    if(!id || !params){
      ctx.body = ({
        code: 0,
        message: "缺少重要参数"
      })
      return
    }
    try{
      await Todos.update( id, params)
      ctx.body = ({
        code: 200,
        message: '更改成功'
      })
    }catch(err) {
      console.log(err)
      ctx.body = ({
        code: 0,
        message: '服务器错误'
      })
    }
  },
  delete: async function(ctx, next) {
    let id = ctx.params.id;
    if(!id){
      ctx.body = ({
        code: 0,
        message: "缺少重要参数"
      })
      return
    }
    try{
      await Todos.delete(id)
      ctx.body = ({
        code: 200,
        message: '删除成功'
      })
    }catch(err) {
      console.log(err)
      ctx.body = ({
        code: 0,
        message: '服务器错误'
      })
    }
  },
  insert: async function(ctx, next) {
    let title = ctx.query.title;
    let status = ctx.query.status;
    let created_time = new Date();
    let user_id = ctx.query.user_id;
    if(!title || !status || !user_id){
      ctx.body = ({
        code: 0,
        message: "缺少重要参数"
      })
      return
    }
    try{
      await Todos.insert({ title, status, user_id, created_time});
      ctx.body = ({
        code: 200,
        message: '添加成功'
      })
    }catch(err) {
      console.log(err)
      ctx.body = ({
        code: 0,
        message: '服务器错误'
      })
    }
  }
}

module.exports = todoController;