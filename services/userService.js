const { log } = require("console")
const User = require("../models/User")
const getAlluser = async function (req, res) {
    const user = await User.findAll()
    res.json({
        code: '200',
        data: user
    })

}
const getUserByUserName = async function (req, res) {
    const userName = req.query.userName
    const user = await User.findOne({
        where: {
            userName: userName
        }
    })
console.log(user.password);
    res.json({
        code: '200',
        data: user
    })

}

module.exports = {
    getUserByUserName,
    getAlluser
}