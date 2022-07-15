const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Library', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        author: {
            type: DataTypes.STRING,
            unique: true, allowNull: false
        }
    })
};

/*
liked: [],
playlists: [],
albums: [],
artists: []
 */
