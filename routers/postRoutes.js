const express=require('express');
const postService = require('../services/postService');
const { route } = require('./userRoutes');
const router=express.Router();

router.post("/add",postService.postAdd)
router.get("/getAllPost",postService.getAllPost)
router.get("/getPostByTag",postService.getPostByTag)
router.post("/postDel",postService.postDel)
router.post("/postEdit",postService.postEdit)
router.get("/getPostWhereRecommend",postService.getPostWhereRecommend)
router.get("/getPostById",postService.getPostById)
router.get("/getPostTags",postService.getPostTags)
module.exports = router