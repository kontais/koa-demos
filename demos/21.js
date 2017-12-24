const os = require('os');
const path = require('path');
const Koa = require('koa');
const fs = require('fs');
const koaBody = require('koa-body');

const app = new Koa();

// curl --form upload=@./Koa/package.json http://127.0.0.1:3000
// ["C:\\Users\\kontais\\AppData\\Local\\Temp\\package.json"]
// const main = async function(ctx) {
const main = function(ctx) {
  const tmpdir = os.tmpdir();
  const fileSaves = [];
  const files = ctx.request.body.files || {};

  for (let key in files) {
    const file = files[key];

    console.log('key=' + key);    // upload
    console.log('name=' + file.name); // package.json
    console.log('path=' + file.path); // C:\Users\kontais\AppData\Local\Temp\upload_42143ec81bd35faf5e60a2942fe6d352

    const fileSave = path.join(tmpdir, file.name);
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(fileSave);
    reader.pipe(writer);
    fileSaves.push(fileSave);
  }

  ctx.body = fileSaves;
};

app.use(koaBody({ multipart: true }));
app.use(main);
app.listen(3000);
