const mongoose = require('mongoose');
const argon2 = require('argon2');

const User = require('./Models/User');
const Track = require('./Models/Track');
const Album = require('./Models/Album');
const Artist = require('./Models/Artist');
const Playlist = require('./Models/Playlist');

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
            $or: [ { email: email }, { username: username } ]
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
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        const verif = await argon2.verify(user.password, password)
        if (!verif) return false

        return user
    }

    async oauth2(oauth) {

        const user = await User.findOne({
            $or: [ { email: oauth.email }, { username: oauth.username } ]
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
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false
        return user
    }

    async getUserLibrary({ email, username }) {
        const user = (await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })
            .populate("liked")
            .populate("albums")
            .populate("artists")
            .populate("playlists")
            .exec())
            .toObject({
                transform: (doc, ret) => {
                    delete ret._id;
                    delete ret.__v;
                    return ret;
                }
            })

        if (!user) return false
        return { liked: user.liked, albums: user.albums, artists: user.artists, playlists: user.playlists }
    }

    async addLiked({ email, username }, trackData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let track = await Track.findOne({
            $or: [
                { providerId: trackData.providerId ? trackData.providerId : 1 },
                { youtubeId: trackData.youtubeId ? trackData.youtubeId : "null" }
            ]
        })

        if (!track) {
            track = new Track(trackData)
            await track.save()
        }

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $addToSet: { liked: track._id } }
        );
    }

    async addAlbum({ email, username }, albumData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let album = await Album.findOne({
            id: albumData.id
        })

        if (!album) {
            album = new Album(albumData)
            await album.save()
        }

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $addToSet: { albums: album._id } }
        );
    }

    async addArtist({ email, username }, artistData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let artist = await Artist.findOne({
            id: artistData.id
        })

        if (!artist) {
            artist = new Artist(artistData)
            await artist.save()
        }

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $addToSet: { artists: artist._id } }
        );
    }

    async addPlaylist({ email, username }, playlistData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let playlist = await Playlist.findOne({
            $or: [
                { providerId: playlistData.providerId ? playlistData.providerId : 1 },
                { youtubeId: playlistData.youtubeId ? playlistData.youtubeId : "null" }
            ]
        })

        if (!playlist) {
            playlist = new Playlist(playlistData)
            await playlist.save()
        }

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $addToSet: { playlists: playlist._id } }
        );
    }

    async createPlaylist({ email, username }, playlistData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let playlist = await Playlist.findOne({
            name: playlistData.name,
            creator: { id: user._id }
        })

        if (!playlist) {
            playlist = new Playlist({
                name: playlistData.name,
                creator: { id: user._id },
                imageCode: playlistData.imageCode,
                mode: "created"
            })
            await playlist.save()
        }

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $addToSet: { playlists: playlist._id } }
        );
    }

    async addTrackToPlaylist({ email, username }, trackData, playlistId) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        }).populate("playlists");

        if (!user) return false

        const playlist = user.playlists.find(el => {
            return el._id.toString() === playlistId;
        })

        if (!playlist) return false

        let track = await Track.findOne({
            $or: [
                { providerId: trackData.providerId ? trackData.providerId : 1 },
                { youtubeId: trackData.youtubeId ? trackData.youtubeId : "null" }
            ]
        })

        if (!track) {
            track = new Track(trackData)
            await track.save()
        }

        return Playlist.findByIdAndUpdate(
            playlistId,
            { $addToSet: { tracks: track._id } }
        );
    }

    async deleteLiked({ email, username }, trackData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let track = await Track.findOne({
            $or: [
                { providerId: trackData.providerId ? trackData.providerId : 1 },
                { youtubeId: trackData.youtubeId ? trackData.youtubeId : "null" }
            ]
        })

        if (!track) return false

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $pull: { liked: track._id } }
        );
    }

    async deleteAlbum({ email, username }, albumData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let album = await Album.findOne({
            id: albumData.id
        })

        if (!album) return false

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $pull: { albums: album._id } }
        );
    }

    async deleteArtist({ email, username }, artistData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let artist = await Artist.findOne({
            id: artistData.id
        })

        if (!artist) return false

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $pull: { artists: artist._id } }
        );
    }

    async deletePlaylist({ email, username }, playlistData) {
        const user = await User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false

        let playlist = await Playlist.findOne({
            $or: [
                { providerId: playlistData.providerId ? playlistData.providerId : 1 },
                { youtubeId: playlistData.youtubeId ? playlistData.youtubeId : "null" }
            ]
        })

        if (!playlist) return false

        return User.findOneAndUpdate(
            { $or: [ { email: email }, { username: username } ] },
            { $pull: { playlists: playlist._id } }
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
