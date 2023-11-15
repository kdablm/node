const express=require('express');
const loginService=require('../services/loginService')
const router=express.Router();
// 路由
router.post("/login",loginService.userLogin)
router.post("/register",loginService.userRegister)
module.exports=router