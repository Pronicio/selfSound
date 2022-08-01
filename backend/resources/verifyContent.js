const { video_basic_info } = require('play-dl');
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
        const res = await axios.get(`https://api.deezer.com/playlist/${data.id}`);
        const playlist = res.data
        return {
            providerId: playlist.id,
            title: playlist.title,
            picture: playlist.md5_image,
            creator: {
                id: playlist.creator.id,
                name: playlist.creator.name,
            },
            tracks: null
        }
    },
    async verifAlbum(data) {
        const res = await axios.get(`https://api.deezer.com/album/${data.id}`);
        const album = res.data
        return {
            providerId: album.id,
            title: album.title,
            picture: album.md5_image,
            artist: {
                id: album.artist.id,
                name: album.artist.name,
            }
        }
    },
    async verifArtist(data) {
        const res = await axios.get(`https://api.deezer.com/artist/${data.id}`);
        const artist = res.data
        return {
            providerId: artist.id,
            name: artist.name,
            picture: artist.picture_medium,
        }
    }
};
