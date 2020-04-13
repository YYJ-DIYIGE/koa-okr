const router = require('koa-router')({
  prefix: '/'
})
const indexController = require('../contorllers/okr.js');
router.get('/', indexController.all)

module.exports = router