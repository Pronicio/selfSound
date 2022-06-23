const mongoose = require('mongoose');
const argon2 = require('argon2');

const User = require('./Models/User');
const Library = require('./Models/Library');

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

    async getUserLibrary({username}) {
        const userLib = await Library.findOne({
            author: username
        })

        if (!userLib) {
            return new Library({
                author: username,
            })
        }

        return userLib
    }

    async putInUserLibrary(username, action, data) {
        let userLib = await Library.findOne({
            author: username
        })

        if (!userLib) {
            userLib = new Library({
                author: username,
            })
        }

        switch (action) {
            case 'like':
                if (data.trackId || data.videoId) {
                    const providerSearch = userLib.liked.find(el => {
                        if (!el.trackId) return false
                        return el.trackId === data.trackId
                    })
                    const ytbSearch = userLib.liked.find(el => {
                        if (!el.videoId) return false
                        return el.videoId === data.videoId
                    })
                    if (providerSearch || ytbSearch) return false
                    userLib.liked.push(data)
                }
                break;
            case 'playlist':
                userLib.playlists.push(data)
                break;
            case 'album':
                userLib.albums.push(data)
                break;
            case 'artist':
                userLib.artists.push(data)
                break;
            default:
                return false
        }

        await userLib.save()
        return userLib
    }

    _genPassword(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$*=+}@àç^è|#"~é.,?;&';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

}

module.exports = Database;
