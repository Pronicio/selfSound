const mongoose = require('mongoose');
const argon2 = require('argon2');

const {verifyMusic, verifPlaylist, verifAlbum, verifArtist} = require('../resources/verifyContent')

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

    async createInUserLibrary(username, action, data) {
        let userLib = await Library.findOne({
            author: username
        })

        if (!userLib) {
            userLib = new Library({
                author: username,
            })
        }

        switch (action) {
            case 'playlist':
                if (data.id) {
                    const alreadyExist = userLib.playlists.find(el => {
                        return el.providerId === data.id
                    })
                    if (alreadyExist) return false

                    const playlist = await verifPlaylist(data)
                    userLib.playlists.push(playlist)
                } else {
                    const alreadyExist = userLib.playlists.find(el => {
                        return el.title === data.title
                    })
                    if (alreadyExist) return false

                    const newPlaylist = {
                        providerId: null,
                        title: data.title,
                        picture: data.picture,
                        tracks: []
                    }

                    userLib.playlists.push(newPlaylist)
                }
                break;
            case 'album':
                if (data.id) {
                    const alreadyExist = userLib.albums.find(el => {
                        return el.providerId === data.id
                    })
                    if (alreadyExist) return false

                    const album = await verifAlbum(data)
                    userLib.albums.push(album)
                }
                break;
            case 'artist':
                if (data.id) {
                    const alreadyExist = userLib.artists.find(el => {
                        return el.providerId === data.id
                    })
                    if (alreadyExist) return false

                    const artist = await verifArtist(data)
                    userLib.artists.push(artist)
                }
                break;
            default:
                return false
        }

        await userLib.save()
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

                    const verif = await verifyMusic(data);

                    if (verif) userLib.liked.push(verif)
                    else return false
                }
                break;
            case 'playlist':
                const playlist = userLib.playlists.find(el => {
                    return el.title === data.title
                })
                const index = userLib.playlists.indexOf(playlist)

                //TODO: Verif Music + put in the playlist

                userLib.playlists[index] = {
                    ...playlist,

                }
                break;
            default:
                return false
        }

        await userLib.save()
        return userLib
    }

    async deleteInUserLibrary(username, action, data) {
        let userLib = await Library.findOne({
            author: username
        })

        if (!userLib) {
            userLib = new Library({
                author: username,
            })
        }

        switch (action) {
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
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!§$*=+}@àç[]^_è|#"~é.,?;&';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

}

module.exports = Database;
