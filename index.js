import Koa from 'koa'
import koaStatic from 'koa-static'
// import axios from 'axios'
import fs from 'fs'

const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.ip} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(koaStatic('public'));

app.use(async ctx => {
  if(ctx.request.URL.pathname === "/planes") {
    ctx.body = fs.readdirSync('public/planesData');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);