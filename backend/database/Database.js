const mongoose = require('mongoose');
const argon2 = require('argon2');

const User = require('./Models/User');
const Track = require('./Models/Track');

const { verifyMusic, verifPlaylist, verifAlbum, verifArtist } = require('../resources/verifyContent')

class Database {

    constructor(url) {
        this.url = url;

        try {
            (async () => {
                await mongoose.connect(this.url, {
                    useNewUrlParser: true
                });
                console.log('Connection has been established successfully with the database.');
            })();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async register({ email, username, password }, oauth) {

        const userExist = await User.findOne({
            $or: [{ email: email }, { username: username }]
        })

        if (userExist) return false

        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            hashLength: 32,
        });

        const user = new User({
            username: username,
            email: email,
            password: hash.toString(),
            locale: oauth?.locale,
            avatar: oauth?.avatar,
            oauth2: {
                discord: oauth?.discord
            }
        })

        await user.save()
        return user
    }

    async login({ email, username, password }) {

        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        })

        if (!user) return false

        const verif = await argon2.verify(user.password, password)
        if (!verif) return false

        return user
    }

    async oauth2(oauth) {

        const user = await User.findOne({
            $or: [{ email: oauth.email }, { username: oauth.username }]
        })

        if (user) return user

        return this.register({
            email: oauth.email,
            username: oauth.username,
            password: this._genPassword(40)
        }, oauth)
    }

    async getUser({ email, username }) {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        })

        if (!user) return false
        return user
    }

    async getUserLibrary({ email, username }) {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        }).populate("liked")

        if (!user) return false
        return { ...user.liked }
    }

    async addLiked({ email, username }, trackData) {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        })

        if (!user) return false

        let track = await Track.findOne({
            $or: [
                { providerId: trackData.providerId ? trackData.providerId : "null" },
                { youtubeId: trackData.youtubeId ? trackData.youtubeId : "null" }
            ]
        })

        if (!track) {
            track = new Track(trackData)
            await track.save()
        }

        return User.findOneAndUpdate(
            { $or: [{ email: email }, { username: username }] },
            { $addToSet: { liked: track._id } }
        );
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
