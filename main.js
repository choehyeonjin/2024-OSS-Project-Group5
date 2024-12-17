"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");
const userRoutes = require("./functions/model/user-routes");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// 정적 파일 제공 (public 디렉토리)
//app.use(express.static(path.join(__dirname, "public")));
// 정적 파일 제공 설정
app.use(express.static('public'));

// 기본 경로로 요청 시 index.html 제공
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API 라우트
app.use("/api", userRoutes.routes);

// 서버 시작
app.listen(config.port, () =>
    console.log("App is Listening on url http://localhost:" + config.port)
);