// models/Post.js

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Tag = require("./Tag");
const User = require("./User");
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId:{
        type: DataTypes.STRING,
        allowNull: false
    },
    recommend:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isDelete:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
});
Post.belongsToMany(Tag, { through: 'PostTag' });
Post.belongsToMany(User, { through: 'PostUser' });
module.exports = Post;
