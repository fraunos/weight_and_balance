import Koa from 'koa'
import koaStatic from 'koa-static'
// import axios from 'axios'
import fs from 'fs'

const app = new Koa();

app.use(koaStatic('public'));


app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


app.use(async ctx => {
  if(ctx.request.URL.pathname === "/planes") {
    // let {callsign} = ctx.query
    // if(callsign){
      // ctx.body = fs.read;
    // } else {
      // ctx.body = callsign;
    // }
    ctx.body = fs.readdirSync('public/planesData');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);