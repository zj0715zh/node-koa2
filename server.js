const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const views = require('koa-views')
const co = require('co')
const koa2Req = require('koa2-request');
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
//异常错误处理中间件
const handleError = require('./middleware/error')
//请求日志中间件
const reqLogs = require('./middleware/log')
const path = require('path')
const config = require('./config')
const pageRouter = require('./routes/index')
const apiRouter = require('./apiProxy/index')

const port = process.env.PORT || config.port

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'html': 'ejs'},
    extension: 'html'
  }))
  .use(reqLogs)
  .use(router.routes())
  .use(router.allowedMethods())
  .use(handleError)


router.get('/', async (ctx, next) => {
  // ctx.body = 'Hello World'
  ctx.state = {
    title: '首页'
  }
  await ctx.render('index', ctx.state)
})


//额外的路由
pageRouter(router)
apiRouter(router)
app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
