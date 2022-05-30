const { stream, video_basic_info } = require('play-dl');
const { search } = require("youtube-ext");

async function routes(fastify, options) {

    /**
     * Search video in YouTube
     * @body {string} query The title to search
     * @param {boolean} music Directly audio ?
     * @param {number} limit Number of video
     */
    fastify.post('/search', async (req, rep) => {
        const query = req.body.query;

        if (req.query.music === "true") {
            const music = await search(`${query} audio`, /*{ filterType: "video" }*/)

            return rep.send(music.videos[0])
        }

        const results = await search(query)

        rep.send(results.videos)
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
