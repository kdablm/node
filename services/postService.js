const { where } = require("sequelize");
const Post = require("../models/Post");
const Tag = require("../models/Tag");
const getDate = require("../utils/Date");
const Snowflake = require("../utils/Snowflake");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
// 添加
const postAdd = async function (req, res) {
    const { title, content, tagId, userId } = req.body
    // 插入数据
    const dataCenterId = 1;
    const machineId = 1;
    const snowflake = new Snowflake(dataCenterId, machineId);
    const generatedId = snowflake.generateId();
    const newPost = await Post.create({
        id: generatedId,
        title,
        content,
        createdAt: getDate(),
        updatedAt: getDate(),
        userId
    })
    await newPost.addTags(tagId);
    await newPost.addUsers(userId)
    if (newPost) {
        res.json({
            code: '200',
            msg: '添加成功'
        })
    } else {
        res.json({
            code: '201',
            msg: '未知错误！'
        })
    }
}
// 获取所有文章
const getAllPost = async function (req, res) {
    try {
        // 分页数据
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size
        const post = await Post.findAll({
            where: {
                IsDelete: 0
            },
            include: [
                { model: Tag, through: 'PostTag' },
                { model: User, through: 'PostUser' }
            ],
            offset,
            limit: size,
            order: [['updatedAt', 'DESC']]
        });
        res.json({
            code: '200',
            msg: '查询成功',
            data: post
        })
    } catch (error) {
        res.json({
            code: '201',
            msg: '查询失败'
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'getAllPost_error.log'), `${new Date()} - ${error.message}\n`);
    }
}
// 获取文章
const getPostById = async (req, res) => {
    try {
        const { id } = req.query;
        const post = await Post.findByPk(id, {
            include: [
                { model: Tag, through: 'PostTag' },
                { model: User, through: 'PostUser' }
            ],
        })
        res.json({
            code: '200',
            msg: '查询成功',
            data: post
        })
    } catch (error) {
        res.json({
            code: '201',
            msg: '查询失败'
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'getPostById_error.log'), `${new Date()} - ${error.message}\n`);
    }
}
//获取热门文章
const getPostWhereRecommend = async (req, res) => {
    try {
        // 分页数据
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size
        const post = await Post.findAll({
            where: {
                IsDelete: 0,
                recommend: 1
            },
            include: [
                { model: Tag, through: 'PostTag' },
                { model: User, through: 'PostUser' }
            ],
            offset,
            limit: size,
            order: [['updatedAt', 'DESC']]
        });
        res.json({
            code: '200',
            msg: '查询成功',
            data: post
        })
    } catch (error) {
        res.json({
            code: '201',
            msg: '查询失败'
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'getPostWhereRecommend_error.log'), `${new Date()} - ${error.message}\n`);
    }
}
// 获取特定标签文章
const getPostByTag = async (req, res) => {
    try {
        // 标签数据
        const { tagId } = req.query;
        // 分页数据
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size

        const post = await Post.findAll({
            where: {
                IsDelete: 0
            },
            include: [{
                model: Tag,
                where: { id: tagId },
                through: 'PostTag'
            }],
            offset,
            limit: size,
            order: [['updatedAt', 'DESC']]
        })
        res.json({
            code: '200',
            msg: '查询成功',
            data: post
        })
    } catch (error) {
        res.json({
            code: '201',
            msg: '查询失败',
            error: error.message
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'getPostByTag_error.log'), `${new Date()} - ${error.message}\n`, { flag: 'a' });
    }
}
// 删除文章
const postDel = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Post.update(
            { isDelete: 1 },
            {
                where: {
                    id: id,
                }
            }
        )
        res.json({
            code: '200',
            msg: '操作成功',
        })
    } catch (error) {
        res.json({
            code: '201',
            msg: '操作失败',
            error: error.message
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'postDel_error.log'), `${new Date()} - ${error.message}\n`, { flag: 'a' });
    }
}
// 编辑文章
const postEdit = async (req, res) => {
    try {
        const { id, title, content, tagId } = req.body
        // 更新post数据
        const result = await Post.update(
            { title, content },
            {
                where: {
                    id: id,
                },
                include: [{ model: Tag, through: 'PostTag' }]
            }
        )
        // 更新关联数据
        const post = await Post.findByPk(id, {
            include: [{ model: Tag, through: 'PostTag' }]

        })
        // 接触绑定
        const currentTags = post.Tags;
        await post.removeTags(currentTags)
        // 添加绑定
        await post.addTags(tagId)
        res.json({
            code: '200',
            msg: '操作成功',
        })
    }
    catch (error) {
        res.json({
            code: '201',
            msg: '操作失败',
            error: error.message
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'postEdit_error.log'), `${new Date()} - ${error.message}\n`, { flag: 'a' });
    }
}
// 获取文章标签
const getPostTags = async (req, res) => {
    try {
        const tags = await Tag.findAll(
            {
                order: [['id', 'asc']]
            }
        );
        res.json({
            code: '201',
            msg: '查询成功',
            data: tags
        })
    } catch (error) {
        res.json({
            code: '201',
            msg: '查询失败',
            error: error.message
        })
        fs.appendFileSync(path.join(__dirname, 'logs', 'getPostTags_error.log'), `${new Date()} - ${error.message}\n`, { flag: 'a' });
    }
}
module.exports = {
    postAdd,
    getAllPost,
    getPostByTag,
    postDel,
    postEdit,
    getPostWhereRecommend,
    getPostById,
    getPostTags
}