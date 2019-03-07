const koa2Req = require('koa2-request');
const reqHost = 'http://demo.api.com';
module.exports =  (router) => {
    //接口转发DEMO
    router.post('/redirect', async (ctx, next) => {
        await koa2Req({
            url: billReqHost+'/api/redirect',
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(ctx.request.body)
        }).then((res)=>{
            ctx.body = res.body
        }).catch((error)=>{
            console.log(error)
            ctx.body = {code:-1,message:'请求/api/redirect接口失败'}
        })
    })
    //非数据接口返回DEMO
    router.post('/api', async (ctx, next) => {
        ctx.body = {code:0,message:'success',data:null}
    })
}