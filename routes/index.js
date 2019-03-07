module.exports =  (router) => {
  router.get('/error', async function (ctx, next) {
    ctx.state = {
      title: '错误页面'
    };

    await ctx.render('error', ctx.state);
  })
  
  router.get('/hs', async function (ctx, next) {
    ctx.body = 'OK'
  })
  
}