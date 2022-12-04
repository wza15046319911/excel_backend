const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const tcb = require('@cloudbase/node-sdk')

// 初始化云开发
const app1 = tcb.init({
  secretId: "AKIDAuObYUndR8cIjs8a8Ta6PTGn7C3hwhz8",
  secretKey: "AzcptuLgqrHW4Sjtuk6LgYGpLfnlzqX3",
  env: "cloudbase-prepaid-8eqh90441a925f"
})

// 初始化auth对象
const auth = app1.auth()

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

const db = app1.database()

// test API
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
