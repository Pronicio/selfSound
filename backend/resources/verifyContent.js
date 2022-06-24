const { deezer, video_basic_info } = require('play-dl');

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
            const res = await deezer(`https://www.deezer.com/track/${data.trackId}`);
            return {
                trackId: res.id,
                videoId: null,
                title: res.shortTitle ? res.shortTitle : res.title,
                artist: {
                    id: res.artist.id,
                    name: res.artist.name,
                },
                album: {
                    id: res.album.id,
                    cover: {
                        ...res.album.cover
                    }
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
