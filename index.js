const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const tcb = require('@cloudbase/node-sdk')

const { secretId, secretKey, cloudEnv } = process.env

// 初始化云开发
const app1 = tcb.init({
  secretId: secretId,
  secretKey: secretKey,
  env: cloudEnv
})

const db = app1.database()
const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});



// test API
// 返回指定openid的用户信息
app.get("/api/data", async (req, res) => {
  const collection = db.collection('UMEL_MainUser')
  const result = await collection.where({
    _openid: 'o-B6w5eKnRniFdjywNhRy7XksQpw'
  }).get()
  res.send(result.data)
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
