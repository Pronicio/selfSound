const { search, stream, video_basic_info } = require('play-dl');

async function routes(fastify, options) {

    /**
     * Search video in YouTube
     * @body {string} query The title to search
     * @param {boolean} music Directly audio ?
     * @param {number} limit Number of video
     */
    fastify.post('/search', async (req, rep) => {
        const query = req.body.query;
        const limit = req.query.limit;

        if (req.query.music === "true") {
            const music = await search(`${query} audio`, { limit: 1 })
            return rep.send(music[0])
        }

        const results = await search(query, { limit: limit ? parseInt(limit) : 1 })
        rep.send(results)
    })

    /**
     * Get the stream url of a video in YouTube
     * @body {string} videoID The videoID of the video
     */
    fastify.post('/stream', async (req, rep) => {
        try {
            const results = await stream(`https://www.youtube.com/watch?v=${req.body.videoID}`);

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
        const results = await video_basic_info(`https://www.youtube.com/watch?v=${req.body.videoID}`);
        rep.send(results)
    })
}

module.exports = routes;
