const {search, stream, video_basic_info} = require('play-dl');
const YoutubeMusicApi = require('youtube-music-api')

async function routes(fastify, options) {

    const api = new YoutubeMusicApi()
    await api.initalize();

    /**
     * Search video in YouTube
     * @body {string} query The title to search
     * @param {boolean} music Directly audio ?
     * @param {number} limit Number of video
     */
    fastify.post('/search', async (req, rep) => {
        let query = req.body.query;

        if (req.query.music === "true") {
            let music = await api.search(query, "song");

            return rep.send(music.content)
        }

        let results = await search(query, {
            limit: req.query.limit ? parseInt(req.query.limit) : 1
        })

        rep.send(results)
    })

    /**
     * Get the stream url of a video in YouTube
     * @body {string} videoID The videoID of the video
     */
    fastify.post('/stream', async (req, rep) => {

        try {
            let results = await stream(`https://www.youtube.com/watch?v=${req.body.videoID}`);

            rep.send({
                url: results.url
            })
        } catch (e) {
            rep.status(500).send({
                error: true
            })
        }

    })

    /**
     * Get the stream url of a video in YouTube
     * @body {string} videoID The videoID of the video
     */
    fastify.post('/video-info', async (req, rep) => {

        let results = await video_basic_info(`https://www.youtube.com/watch?v=${req.body.videoID}`);
        rep.send(results)
    })
}

module.exports = routes;
