// models/Tag.js

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});



module.exports = Tag;
