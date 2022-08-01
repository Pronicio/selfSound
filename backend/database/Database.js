const { Sequelize, Op } = require('sequelize');
const argon2 = require('argon2');
const { readdirSync } = require('fs');

const { verifyMusic, verifPlaylist, verifAlbum, verifArtist } = require('../resources/verifyContent')

class Database {

    constructor(url) {
        this.url = url;

        this.sequelize = new Sequelize(url, {
            logging: false
        })

        try {
            (async () => {
                await this._handleModels()
                await this.sequelize.authenticate();
                //await this.sequelize.sync({ force: true });
                console.log('Connection has been established successfully with the database.');
            })();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async register({ email, username, password }, oauth) {

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

        const user = await this.User.create({
            username: username,
            email: email,
            password: hash.toString(),
            locale: oauth?.locale,
            avatar: oauth?.avatar,
            oauth2: {
                discord: oauth?.discord
            }
        })

        await this.Library.create({ author: username });

        return user
    }

    async login({ email, username, password }) {

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
        const user = await this.User.findOne({
            $or: [ { email: email }, { username: username } ]
        })

        if (!user) return false
        return user
    }

    async getUserLib({ username }) {
        return await this.Library.findOne({
            where: { author: username },
            include: [ this.Track ]
        });
    }

    async addTrackToLib(lib, trackData) {
        try {
            let track = await this.Track.findOne({
                where: {
                    [Op.or]: [
                        { providerId: trackData.providerId ? trackData.providerId : "null" },
                        { youtubeId: trackData.youtubeId ? trackData.youtubeId : "null" }
                    ]
                }
            })
            console.log("track_find", track)

            if (!track) {
                track = await this.Track.create(trackData)
                console.log("track_create", track)

                let AlbumOfTheTrack = await this.Album.findOne({
                    where: {
                        [Op.or]: [
                            { providerId: trackData.album.providerId ? trackData.album.providerId : "null" },
                            { youtubeId: trackData.album.youtubeId ? trackData.album.youtubeId : "null" }
                        ]
                    }
                })
                let ArtistOfTheTrack = await this.Artist.findOne({
                    where: {
                        [Op.or]: [
                            { providerId: trackData.artist.providerId ? trackData.artist.providerId : "null" },
                            { youtubeId: trackData.artist.youtubeId ? trackData.artist.youtubeId : "null" }
                        ]
                    }
                })
                console.log("AlbumOfTheTrack_f", AlbumOfTheTrack)
                console.log("ArtistOfTheTrack_f", ArtistOfTheTrack)

                if (!AlbumOfTheTrack) AlbumOfTheTrack = await this.Album.create(trackData.album)
                if (!ArtistOfTheTrack) ArtistOfTheTrack = await this.Artist.create(trackData.artist)
                console.log("AlbumOfTheTrack_c", AlbumOfTheTrack)
                console.log("ArtistOfTheTrack_c", ArtistOfTheTrack)

                await track.addAlbum(AlbumOfTheTrack)
                await AlbumOfTheTrack.addTrack(track)

                await track.addArtist(ArtistOfTheTrack)
                await ArtistOfTheTrack.addTrack(track)

                await track.save()
            }

            await lib.addTrack(track)
        } catch (e) {
            console.error(e)
        }
    }

    async getTrack(id) {
        const track = await this.Track.findOne({
            where: { id: id },
            include: [ this.Album, this.Artist ]
        });

        return { ...track.toJSON() }
    }

    async _handleModels() {
        await readdirSync(`${__dirname}/Models`).forEach(folderName => {
            if (folderName.includes('.js')) {
                const fileName = folderName.replace('.js', '').trim();
                this[fileName] = require(`${__dirname}/Models/${fileName}`)(this.sequelize);
            } else {
                readdirSync(`${__dirname}/Models/${folderName}`).forEach(fileName => {
                    fileName = fileName.replace('.js', '').trim();
                    this[fileName] = require(`${__dirname}/Models/${folderName}/${fileName}`)(this.sequelize);
                })
            }
        });

        this._handleAssociations()
    }

    _handleAssociations() {
        this.User.hasOne(this.Library, { targetKey: 'author', foreignKey: 'username' });
        this.Library.belongsTo(this.User, { targetKey: 'username', foreignKey: 'author' });

        this.Track.belongsToMany(this.Library, { through: 'LikedTitles' })
        this.Library.hasMany(this.Track)

        //TODO: Albums / Artists / Playlists
        this.Track.hasMany(this.Album)
        this.Album.belongsToMany(this.Track, { through: 'TracksAlbum' })

        this.Track.hasMany(this.Artist)
        this.Artist.belongsToMany(this.Track, { through: 'TracksArtist' })

        //TODO: Finish that :
        this.Album.hasOne(this.Artist)
        this.Artist.belongsToMany(this.Album, { through: 'ArtistsAlbums' })
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
