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
  .use(router.routes())
  .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  const res = ctx
  await next()
  const ms = new Date() - start
  console.log(`"请求域名"：${res.request.host},"请求接口路径"：${res.request.path},"请求方法"：${res.request.method},"请求主体"：${res.request.body} - $ms`)
  console.log(`"响应主体"：${res.body},"响应code"：${res.statusCode},"响应msg"：${res.statusMessage} - $ms`)
})

//404,500异常处理
app.use(async(ctx, next) => {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        console.error(err.stack);
        const status = err.status || 500;
        ctx.status = status;
        if (status === 404) {
            await ctx.render("error",{"status":status});
        } else if (status === 500) {
            await ctx.render("error",{"status":status});
        }
    }
})
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
