const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true, allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true, allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        locale: { type: DataTypes.STRING, defaultValue: 'en',},
        biography: { type: DataTypes.STRING },
        avatar: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    })
};
