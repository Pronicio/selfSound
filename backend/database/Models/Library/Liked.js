const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Liked', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        providerId: {
            type: DataTypes.INTEGER,
            unique: true, allowNull: false
        },
        youtubeId: {
            type: DataTypes.STRING,
            unique: true, allowNull: false
        },
        title: { type: DataTypes.STRING, allowNull: false },
        imageCode: { type: DataTypes.STRING }
    })
};
