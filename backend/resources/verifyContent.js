const { video_basic_info, playlist_info } = require('play-dl');
const axios = require('axios');

module.exports = {
    async verifyMusic(data) {
        if (data.providerId) {
            const res = await axios.get(`https://api.deezer.com/track/${data.providerId}`);
            const track = res.data
            return {
                providerId: track.id,
                youtubeId: null,
                title: track.title_short ? track.title_short : track.title,
                imageCode: track.md5_image,
                artist: {
                    id: track.artist.id,
                    name: track.artist.name,
                },
                album: {
                    id: track.album.id
                }
            }
        } else if (data.youtubeId) {
            const res = await video_basic_info(`https://www.youtube.com/watch?v=${data.youtubeId}`);
            const video = res.video_details
            return {
                providerId: 0,
                youtubeId: video.id,
                title: video.title,
                artist: {
                    id: video.channel.id,
                    name: video.channel.name,
                }
            }
        }

        return false
    },
    async verifPlaylist(data) {
        if (data.providerId) {
            const res = await axios.get(`https://api.deezer.com/playlist/${data.providerId}`);
            const playlist = res.data
            return {
                providerId: playlist.id,
                name: playlist.title,
                imageCode: playlist.md5_image,
                creator: {
                    id: playlist.creator.id,
                    name: playlist.creator.name,
                },
                tracks: null
            }
        } else if (data.youtubeId) {
            const res = await playlist_info(`https://www.youtube.com/playlist?list=${data.youtubeId}`, { incomplete: true });
            return {
                youtubeId: res.id,
                name: res.title,
                picture: null,
                creator: {
                    id: res.channel.id,
                    name: res.channel.name,
                },
                tracks: null
            }
        }
    },
    async verifAlbum(data) {
        const res = await axios.get(`https://api.deezer.com/album/${data.id}`);
        const album = res.data;
        return {
            id: album.id,
            title: album.title,
            imageCode: album.md5_image.match(/[0-9a-f]{32}/g)[0]
        }
    },
    async verifArtist(data) {
        const res = await axios.get(`https://api.deezer.com/artist/${data.id}`);
        const artist = res.data
        return {
            id: artist.id,
            name: artist.name,
            imageCode: artist.picture_medium.match(/[0-9a-f]{32}/g)[0]
        }
    }
};
