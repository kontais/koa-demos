const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();

// 最外层的中间件，负责所有中间件的错误处理
// 重构500
const error_handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    };
    ctx.app.emit('error', err, ctx);
  }
};
app.use(error_handler);

// 运行过程中一旦出错，Koa 会触发一个error事件。监听这个事件，也可以处理错误。
app.on('error', (err, ctx) => {
  console.error('server error:', err.message);
});

const main = ctx => {
  ctx.response.body = 'Hello World';
};

const about = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = '<a href="/">Index Page</a>';
};
app.use(route.get('/', main));
app.use(route.get('/about', about));

const throw_error = ctx => {
  ctx.throw(500);
};
app.use(route.get('/error', throw_error));

const app_error = ctx => {
  throw new Error('app error\n');
};
app.use(route.get('/app_error', app_error));

// 重构404
const not_found = ctx => {
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
};
app.use(not_found);

app.listen(3000);


