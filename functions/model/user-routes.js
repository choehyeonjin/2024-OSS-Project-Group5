const express = require("express");
const { addUser } = require("./userController");

const router = express.Router();

router.post("/user", addUser);

module.exports = {
  routes: router,
};
