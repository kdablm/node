const User = require("../models/User");
const getDate = require("../utils/Date");
const fs = require("fs");
const Snowflake = require("../utils/Snowflake");
// 登录
const userLogin = async function (req, res) {
    console.log(req.body);
    const { userName, password } = req.body;
    const user = await User.findOne({
        where: {
            userName: userName
        }
    })
    if (!user) {
        res.json({
            code: '201',
            msg: '用户不存在'
        })
        return
    }
    if (password != user.password) {
        res.json({
            code: '201',
            msg: '用户名或者密码错误'
        })
        return
    }

    res.json({
        code: '200',
        msg: "登录成功",
        user: {
            id: user.id,
            userName: user.userName,
            signature: user.signature
        }
    })
}
//注册
const userRegister = async function (req, res) {
    const { userName, password } = req.body;
    // console.log(req.body);
    const user = await User.findOne({
        where: {
            userName: userName
        }
    })
    if (user) {

        res.json({
            code: "201",
            msg: '用户名存在'
        })
        return
    }
    else if (!userName) {
        res.json({
            code: "201",
            msg: '用户名不能为空'
        })
    } else if (!password) {
        res.json({
            code: "201",
            msg: '密码不能为空'
        })
        return
    }
    try {
        const dataCenterId = 1;
        const machineId = 1;
        const snowflake = new Snowflake(dataCenterId, machineId);
        const generatedId = snowflake.generateId();
        const newUser = User.create({
            id: generatedId,
            userName: userName,
            password: password,
            createdAt: getDate(),
            updatedAt: getDate()
        })
        if (newUser) {
            res.json({
                code: "200",
                msg: "注册成功"
            })

        } else {
            res.json({
                code: "201",
                msg: '发生错误，请重试！！！'
            })
        }
    } catch (error) {
        fs.appendFileSync(path.join(__dirname, 'logs', 'userRegister_error.log'), `${new Date()} - ${error.message}\n`);
    }
}
module.exports = {
    userLogin,
    userRegister
}