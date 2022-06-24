const { video_basic_info } = require('play-dl');
const axios = require('axios');

module.exports = {
    async verifyProvider(userLib, data) {
        const providerSearch = userLib.liked.find(el => {
            if (!el.trackId) return false
            return el.trackId === data.trackId
        })
        const ytbSearch = userLib.liked.find(el => {
            if (!el.videoId) return false
            return el.videoId === data.videoId
        })

        if (providerSearch || ytbSearch) return false

        if (data.trackId) {
            const res = await axios.get(`https://api.deezer.com/track/${data.trackId}`);
            const track = res.data
            return {
                trackId: track.id,
                videoId: null,
                title: track.title_short ? track.title_short : track.title,
                artist: {
                    id: track.artist.id,
                    name: track.artist.name,
                },
                album: {
                    id: track.album.id,
                    cover: track.album.md5_image
                }
            }
        } else if (data.videoId) {
            const res = await video_basic_info(`https://www.youtube.com/watch?v=${data.videoId}`);
            const video = res.video_details
            return {
                trackId: null,
                videoId: video.id,
                title: video.title,
                artist: {
                    id: video.channel.id,
                    name: video.channel.name,
                }
            }
        }

        return false
    }
};
