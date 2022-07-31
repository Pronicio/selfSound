const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Track', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        providerId: {
            type: DataTypes.INTEGER,
            unique: true, allowNull: true
        },
        youtubeId: {
            type: DataTypes.STRING,
            unique: true, allowNull: true
        },
        title: { type: DataTypes.STRING, allowNull: false },
        imageCode: { type: DataTypes.STRING },
        albumId: { type: DataTypes.STRING, allowNull: true },
        artistId: { type: DataTypes.STRING, allowNull: true }
    })
};
