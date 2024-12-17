const functions = require("firebase-functions");
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./model/user-routes.js");

app.get("/", (req, res) => {
  res.send("Hello from Firebase Functions!");
});

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "https://yyjdb-1e121.web.app" }));
app.use("/api", userRoutes.routes);

// Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: "gmail", // gmail 사용
  auth: {
      user: "ossyyj@gmail.com", // 발신 이메일 주소
      pass: "yxwv vupw rzct drqz", // 앱 비밀번호
  },
  debug: true, // 디버그 활성화
  logger: true, // 로그 출력
});

console.log("Transporter created. Attempting to send mail...");

// 아이디 전송 엔드포인트
app.post("/send-id", (req, res) => {
  const { email, userId } = req.body;

  const mailOptions = {
      from: "ossyyj@gmail.com",
      to: email,
      subject: "[요야정] 요청하신 아이디입니다.",
      text: `안녕하세요! 요청하신 아이디는 다음과 같습니다:\n\n아이디: ${userId}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error("Error sending email:", error);
          res.status(500).send("Email not sent");
      } else {
          console.log("Email sent:", info.response);
          res.status(200).send("Email sent");
      }
  });
});

// 비밀번호 전송 엔드포인트
app.post("/send-password", (req, res) => {
  const { email, password } = req.body;

  const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "[요야정] 요청하신 비밀번호입니다.",
      text: `안녕하세요! 요청하신 비밀번호는 다음과 같습니다:\n\n비밀번호: ${password}\n\n비밀번호는 외부에 유출되지 않도록 주의해주세요.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error("Error sending email:", error);
          res.status(500).send("Failed to send email.");
      } else {
          console.log("Email sent successfully:", info.response);
          res.status(200).send("Email sent successfully.");
      }
  });
});

exports.api = functions.https.onRequest(app);