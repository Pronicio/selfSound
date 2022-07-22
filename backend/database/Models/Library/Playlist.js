const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Playlist', {
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
        imageUrl: { type: DataTypes.STRING }
    })
};
