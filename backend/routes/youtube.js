const { search, stream, video_basic_info } = require('play-dl');

async function routes (fastify, options) {
    fastify.get('/', async (req, rep) => {
        return { hello: 'world' }
    })

    /**
     * Search video in YouTube
     * @body {string} query The title to search
     * @param {boolean} audio Directly audio ?
     * @param {number} limit Number of video
     */
    fastify.post('/search', async (req, rep) => {
        let query = `${req.body.query} ${(req.query.audio) === "true" ? "(Audio)" : ""}`;

        let results = await search(query, {
            limit : req.query.limit ? parseInt(req.query.limit) : 1
        })

        rep.send(results)
    })

    /**
     * Get the stream url of a video in YouTube
     * @body {string} videoID The videoID of the video
     */
    fastify.post('/stream', async (req, rep) => {

        let results = await stream(`https://www.youtube.com/watch?v=${req.body.videoID}`);

        rep.send({
            url: results.url,
            quality: results.quality,
            video_url: results.video_url
        })
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
