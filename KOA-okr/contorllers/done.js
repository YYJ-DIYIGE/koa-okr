const Todos = require('./../models/todos');
const {formatTime} = require('./../utils/date');

const doneController = {
  all: async(ctx, next) => {
    try{
      let todoes = await Todos.select({status: 1});
      let todo = todoes.map(data => {
        data.create_time = formatTime(data.create_time);
        if(data.finish_time) {
          data.finish_time = formatTime(data.finish_time);
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
    let id = ctx.query.id;
    let status = ctx.query.status;
    if(!id || !status){
      ctx.body = ({
        code: 0,
        message: "缺少重要参数"
      })
      return
    }
    try{
      await Todos.update( id, {status})
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
  }
}

module.exports = doneController;