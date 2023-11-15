const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const sequelize = new Sequelize('node', 'root', 'xiezhubao450802', {
    host: 'localhost',
    dialect: "mysql",
    logging: (msg) => {
        // 如果日志消息包含 "connection failed"，则记录到日志文件
        if (msg.includes('connection failed')) {
            fs.appendFileSync(path.join(__dirname, 'logs', 'database_connection_error.log'), `${new Date()} - ${msg}\n`);
        }
    },
})


module.exports = sequelize;