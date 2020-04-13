const Objective = require('./../models/objective');
const Keyresult = require('./../models/keyresult');
const TodoKeyresult = require('../models/todoKeyresult');
const Todos = require("./../models/todos");
const {formatTime} = require('./../utils/date');
const okrController = {
  all: async (ctx, next) => {
    try{
      let objectives = await Objective.all();
      let objective = objectives.map(data =>{
        data.create_time = formatTime(data.create_time);
        if(data.finish_time) {
          data.finish_time = formatTime(data.finish_time);
        }
        return data
      })
      let keyresult = await Keyresult.all();
      ctx.body = ({
        code: 200,
        objective,
        keyresult
      })
    }catch(err){
      console.log(err)
      ctx.body = ({
        code: 0,
        message: "服务器错误"
      })
    }
  },
  update: async (ctx, next) =>{
    try{
      let id = ctx.params.id;
      let finish_time = new Date();
      let status = Number(ctx.query.state);
      let state = status ? 0 : 1 ;
      await Objective.update(id,{state,finish_time})
      ctx.body = ({
        code: 200,
        message: "修改成功"
      })
    }catch(err){
      console.log(err)
      ctx.body = ({
        code: 0,
        message: "服务器错误"
      })
    }
  },
  delete: async (ctx, next) =>{
    try{
      let id = ctx.params.id;
      await Objective.delete(id);
      let kyData  =  await Keyresult.where({objective_id:id})
      let ids = kyData.map(data=>data.id);
      await Keyresult.where({objective_id: id}).del();
      await TodoKeyresult.knex().whereIn("keyresult",ids).del()
      ctx.body = ({
        code:200,
        message: '删除成功'
      })
    }catch(err){
      ctx.body = ({
        code:200,
        message: '服务器错误'
      })
    }
  },
  create: async (ctx, next) =>{
    try{
      let user_id = ctx.query.user_id;
      let title = ctx.query.objective;
      let keyresult = JSON.parse(ctx.query.keyresults);
      let status = 0;
      let state = 0;
      let create_time = new Date();
      let objective = await Objective.insert({
          title,
          state,
          create_time,
          user_id
        })
      let objective_id = objective[0]
      keyresult.forEach(async (data) => {
        let title = data.title;
        await Keyresult.insert({
          objective_id,
          title,
          status,
          create_time
        })
      })
      ctx.body = ({
        code: 200,
        message: "添加成功"
      })
    }catch(err){
      ctx.body = ({
        code: 0,
        message: "服务器错误！！！"
      })
    }
  },
  editShow: async　(ctx, next) => {
    try{
      let id = ctx.params.id;
      if(!id){
        ctx.body = ({
          code: 0,
          message: "缺少id"
        })
        return
      }
      let objectives = await Objective.where({id});
      let objTxet = objectives[0].title
      let keyresult = await Keyresult.where({objective_id:id});
      ctx.body = ({
        code: 200,
        objTxet,
        keyresult
      })
    }catch(err){
      ctx.body = ({
        code: 0,
        message: "服务器错误！！！"
      })
    }
  },
  edit: async (ctx, next) =>{
    try{
      let id = ctx.params.id;
      let objective = ctx.query.objective;
      let keyresults = JSON.parse(ctx.query.keyresults);
      let deleteId = JSON.parse(ctx.query.deleteId);
      let create_time = new Date();
      await Objective.update(id,{title:objective, create_time})
      keyresults.forEach(async (data) =>{
       if(data.id){
        await Keyresult.update(data.id,{title:data.title,create_time})
       }else{
        await Keyresult.insert({objective_id: id, title: data.title, status: 0, create_time})
       }
      })
      if(!deleteId){
        ctx.body = ({
          code: 200,
          message: "修改成功"
        })
        return
      }
      deleteId.forEach(async (data)=>{
        await Keyresult.delete(data)
       }) 
      ctx.body = ({
        code: 200,
        message: "修改成功"
      })
    }catch(err){
      ctx.body = ({
        code: 0,
        message: "服务器错误"
      })
    }
  },
  detallshow: async (ctx, next) =>{
    try{
      let id = ctx.params.id;
     let objective = await Objective.where({id});//获取目标
     objective.forEach(data =>{
       data.create_time = formatTime(data.create_time)
       if(data.finish_time){
        data.finish_time = formatTime(data.finish_time)
       }
     })
     let keyresult = await Keyresult.where({objective_id:id}); //获取成果
     let keyresult_id = keyresult.map(data => data.id); //获取成果id
     let todoKeyresults = await TodoKeyresult.knex().whereIn("keyresult",keyresult_id); 
     let todo_id = todoKeyresults.map(data =>  data.todo_id)
     let todos = await Todos.knex().whereIn("id",todo_id); //获取todo
     let krdata = {}
    keyresult.forEach((data,index) =>{
      data.todos = []
      krdata[index] = data
      todoKeyresults.forEach(data=>{
        if(keyresult[index].id == data.keyresult){
          let todoId = data.todo_id
          todos.forEach(data=>{
            if(todoId == data.id){
              krdata[index].todos.push(data)
            }
          })
        }
      })
    })
    ctx.body =({
      code: 200,
      objective,
      krdata
    })
    }catch(err){
      ctx.body =({
        code: 0,
        message: "服务器错误"
      })
    }
  },
  detallupdate: async (ctx, next) =>{
    try{
      let id = ctx.params.id;
      let state = Number(ctx.query.status);
      let status = state ? 0 : 1;
      if (!id) {
        ctx.body =({
          code:0,
          message:"缺少id"
        })
        return
      }
      await Keyresult.update(id,{status})
      // let todoKeyresults = await TodoKeyresult.where({keyresult:id})
      // let todoId = todoKeyresults.map(data => data.todo_id)
      // todoId.forEach (async (data) =>{
      //  await Todos.update(data,{status})
      // })
      ctx.body = ({
        code: 200,
        message: "修改成功"
      })
    }catch(err){
      ctx.body = ({
        code: 0,
        message: "服务器错误！！"
      }) 
    }
  },
  detalldelete: async (ctx, next) =>{
    try{
      let id = ctx.params.id;
      await TodoKeyresult.where({keyresult:id}).del()
      await Keyresult.delete(id)
      ctx.body = ({
        code: 200,
        message: "删除成功"
      })
    }catch(err){
      ctx.body = ({
        code: 0,
        message: "服务器错误"
      })
    }
  }
}

module.exports = okrController;