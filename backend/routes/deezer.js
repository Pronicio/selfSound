const { search, deezer } = require('play-dl');

async function routes (fastify, options) {

    fastify.get('/', async (req, rep) => {
        return { hello: 'world' }
    })

    /**
     * Search music in deezer
     * @body {string} query The title to search
     * @param {number} limit Number of musics
     */
    fastify.post('/search', async (req, rep) => {
        let query = req.body.query;

        let results = await search(query, {
            limit : req.query.limit ? parseInt(req.query.limit) : 1,
            source : {
                deezer : "track"
            }
        })

        rep.send(results)
    })

    /**
     * Get all info of a music from deezer
     * @body {string} musicID The musicID of the music
     */
    fastify.post('/music', async (req, rep) => {

        let results = await deezer(`https://www.deezer.com/track/${req.body.musicID}`);
        rep.send(results)
    })
}

module.exports = routes;
