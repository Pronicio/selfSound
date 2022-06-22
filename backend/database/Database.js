const mongoose = require('mongoose');
const User = require('./Models/User');
const argon2 = require('argon2');

class Database {

    constructor(url) {
        this.url = url;

        mongoose.connect(this.url, {
            useNewUrlParser: true
        });
    }

    async register({email, username, password}, oauth) {

        const userExist = await User.findOne({
            $or: [{email: email}, {username: username}]
        })

        if (userExist) return false

        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            hashLength: 32,
        });

        const newUser = new User({
            username: username,
            email: email,
            password: hash.toString(),
            locale: oauth?.locale,
            avatar: oauth?.avatar,
            oauth2: {
                discord: oauth?.discord
            }
        })

        await newUser.save()
        return newUser
    }

    async login({email, username, password}) {

        const user = await User.findOne({
            $or: [{email: email}, {username: username}]
        })

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

        return await this.register({
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
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$*=+}@àç^è|#"~é.,?;&';
        let charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

}

module.exports = Database;
