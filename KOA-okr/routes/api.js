const router = require('koa-router')({
  prefix: '/api'
})

const okrController = require('./../contorllers/okr');
const todoController = require('./../contorllers/todos');
const loginController = require('./../contorllers/login')
const todoKeyresultContorller = require('./../contorllers/todo_keyesult');
// const authMiddleware = require('./../middlewares/auth');
router.get('/okr', okrController.all);
router.get('/okr/update/:id', okrController.update);
router.delete('/okr/delete/:id', okrController.delete);
router.get('/okr/create',okrController.create);
router.get('/okr/editshow/:id',okrController.editShow);
router.get('/okr/edit/:id',okrController.edit);
router.get('/okr/detall/:id',okrController.detallshow);
router.get('/okr/detall/update/:id',okrController.detallupdate);
router.delete('/okr/detall/delete/:id',okrController.detalldelete);

router.get('/todo', todoController.all);
router.get('/todo/update/:id', todoController.update);
router.delete('/todo/delete/:id', todoController.delete);
router.get('/todo/insert', todoController.insert);

router.get('/login', loginController.login);

router.get('/todo_keyesult/all/:id', todoKeyresultContorller.keyresult);
router.get('/todo_keyesult/insert/:id', todoKeyresultContorller.insert);
router.delete('/todo_keyesult/delete/:id', todoKeyresultContorller.delete);

module.exports = router;