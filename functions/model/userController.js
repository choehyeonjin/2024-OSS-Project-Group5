"use strict";

const firestore = require("../db"); // 수정: firestore만 가져옵니다.

const addUser = async (req, res, next) => {
  try {
    const data = req.body;

    // 필수 필드 확인
    if (!data.ID || !data.PW || !data.email || !data.name) {
      return res.status(400).send("필수 입력 사항이 누락되었습니다.");
    }

    await firestore.collection("User").doc(data.ID).set({
      name: data.name,
      email: data.email,
      ID: data.ID,
      PW: data.PW,
      createdAt: data.createdAt || new Date().toISOString(),
    });

    res.status(201).send("회원가입이 완료되었습니다.");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

module.exports = {
  addUser,
};
