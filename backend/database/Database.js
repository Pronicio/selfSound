const { Sequelize, Op } = require('sequelize');
const argon2 = require('argon2');

const { verifyMusic, verifPlaylist, verifAlbum, verifArtist } = require('../resources/verifyContent')

class Database {

    constructor(url) {
        this.url = url;

        const sequelize = new Sequelize(url, {
            logging: false
        })

        this.User = require('./Models/User')(sequelize);

        try {
            (async () => {
                await sequelize.authenticate();
                //await sequelize.sync({ force: true });
            })();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async register({email, username, password}, oauth) {

        const userExist = await this.User.findOne({
            where: {
                [Op.or]: [
                    { username: username ? username : null },
                    { email: email ? email : null }
                ]
            }
        });

        if (userExist) return false

        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            hashLength: 32,
        });

        return this.User.create({
            username: username,
            email: email,
            password: hash.toString(),
            locale: oauth?.locale,
            avatar: oauth?.avatar,
            oauth2: {
                discord: oauth?.discord
            }
        })
    }

    async login({email, username, password}) {

        const user = await this.User.findOne({
            where: {
                [Op.or]: [
                    { username: username ? username : null },
                    { email: email ? email : null }
                ]
            }
        });

        if (!user) return false

        const verif = await argon2.verify(user.password, password)
        if (!verif) return false

        return user
    }

    async oauth2(oauth) {

        const user = await User.findOne({
            $or: [{email: oauth.email}, {username: oauth.username}]
        })

        if (user) return user

        return this.register({
            email: oauth.email,
            username: oauth.username,
            password: this._genPassword(40)
        }, oauth)
    }

    async getUser({email, username}) {
        const user = await User.findOne({
            $or: [{email: email}, {username: username}]
        })

        if (!user) return false
        return user
    }

    _genPassword(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!§$*=+}@àç[]^_è|#"~é.,?;&';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

}

module.exports = Database;
