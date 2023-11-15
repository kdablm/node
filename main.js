/* ========lib======= */
const fs = require("fs");
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
// 数据库实例
const sequelize = require("./utils/db");
// 表模型
const User = require("./models/User");
const Post = require("./models/Post");
const Tag = require("./models/Tag");
const Snowflake = require("./utils/Snowflake");
// 路由
const userRoutes = require('./routers/userRoutes');
const loginRoutes = require('./routers/loginRoutes');
const postRoutes = require('./routers/postRoutes');
// express实例
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

const port = 8080;

// 异步函数，用于启动服务器
const startServer = async () => {
    try {
        // 同步数据库
        await sequelize.sync();
        console.log('Database synchronized successfully.');

        // 注册路由
        app.use('/users', userRoutes);
        app.use("/userLogin", loginRoutes);
        app.use("/post", postRoutes)
        // 监听端口
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        // 如果出现错误，记录到日志文件
        fs.appendFileSync(path.join(__dirname, 'logs', 'server_start_error.log'), `${new Date()} - ${error.message}\n`);
    }
};

// 启动服务器
startServer();
