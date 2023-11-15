const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    signature:{
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;