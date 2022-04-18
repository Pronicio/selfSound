const { search, stream, getFreeClientID, setToken } = require('play-dl');

async function routes (fastify, options) {

    getFreeClientID().then((clientID) => setToken({
        soundcloud : {
            client_id : clientID
        }
    }))

    fastify.get('/', async (req, rep) => {
        return { hello: 'world' }
    })

    /**
     * Search music in SoundCloud
     * @body {string} query The title to search
     * @param {number} limit Number of musics
     */
    fastify.post('/search', async (req, rep) => {
        let query = req.body.query;

        let results = await search(query, {
            limit : req.query.limit ? parseInt(req.query.limit) : 1,
            source : {
                soundcloud : "tracks"
            }
        })

        rep.send(results)
    })

    /**
     * Get the stream url of a music in SoundCloud
     * @body {string} musicID The musicID of the music
     */
    fastify.post('/stream', async (req, rep) => {

        let results = await stream(`https://api.soundcloud.com/tracks/${req.body.musicID}`);
        rep.send({ url: results.url })
    })
}

module.exports = routes;
