const express = require('express');
const router = express.Router();
const userService = require("../services/userService")
//通过用户名查询用户
router.get("/getUserByuserName", userService.getUserByUserName);
// 查询所有用户
router.get("/getAlluser", userService.getAlluser);
module.exports = router