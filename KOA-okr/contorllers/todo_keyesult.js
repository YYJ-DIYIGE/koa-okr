const objectiveModels = require('../models/objective');
const keyresultModels = require('../models/keyresult');
const TodoKeyresult = require('../models/todoKeyresult');

const todo_keyresultContorller = {
  keyresult: async (ctx,next) => {
    try{
      let todo_id = ctx.params.id
      let user_id = ctx.query.user_id;
      let params = {
        user_id: user_id,
        state: 0
      }
      let objectives = await objectiveModels.select(params)
      let objective_ids = objectives.map(data => data.id);
      let keyresults = await keyresultModels.knex().whereIn('objective_id', objective_ids)
      let todoKeyresults = await TodoKeyresult.select({ todo_id })
      let keyresult_ids = todoKeyresults.map(data => data.keyresult);
      let okr = {};
      objectives.forEach(data => {
        data.keyresults = [];
        okr[data.id] = data
      })
      keyresults.forEach(data => {
        data.active = keyresult_ids.includes(data.id)
        okr[data.objective_id].keyresults.push(data)
      })
      // 返回对象Val值
      okr = Object.values(okr)
      ctx.body = ({
        code:200,
        okr: okr
      })
    }catch(err) {
      ctx.body = ({
        code: 0,
        message: '服务器错误111'
      })
    }
  },
  insert: async (ctx, next) =>{
    let todo_id =  ctx.params.id;
    let keyresult = ctx.query.krId;
    if(!todo_id || !keyresult){
      ctx.body = ({
        code: 0,
        message: "缺少重要参数"
      })
      return
    }
    try{
      await TodoKeyresult.insert({todo_id,keyresult});
      ctx.body= ({
        code: 200,
        message: "绑定成功"
      })
    }catch(err){
      ctx.body= ({
        code: 0,
        message: "失败"
      })
    }
  },
  delete: async (ctx, next) =>{
    try{
      let todo_id =  ctx.params.id;
      let keyresult = ctx.query.krId;
      let IdArr = await TodoKeyresult.select({todo_id,keyresult});
      let id = IdArr[0].id;
      await TodoKeyresult.delete(id);
      ctx.body= ({
        code: 200,
        message: "取关成功"
      })
    }catch(err){
      ctx.body= ({
        code: 0,
        message: "取关失败"
      })
    }
  }
}
module.exports = todo_keyresultContorller;