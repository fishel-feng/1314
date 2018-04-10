const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(__dirname + '/static'));

app.listen(9900);
