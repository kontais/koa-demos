const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

// curl -s -X POST --data "name=Jack" 127.0.0.1:3000
// const main = async function(ctx) {
const main = function(ctx) {
  const body = ctx.request.body;
  if (!body.name) ctx.throw(400, '.name required');
  ctx.body = { name: body.name };
};

app.use(koaBody());
app.use(main);
app.listen(3000);
