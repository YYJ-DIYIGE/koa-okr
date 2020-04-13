const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')
const router = require('./routes/api');
const app = new Koa();
const response = require('./middlewares/response');
const  cors = require('./middlewares/cors');
app
.use(bodyParser())
.use(koaBody())
.use(response)
.use(cors.allowAll)
.use(router.routes())
.use(router.allowedMethods())
.listen(3000);