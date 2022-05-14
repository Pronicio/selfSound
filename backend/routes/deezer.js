const { deezer } = require('play-dl');
const axios = require('axios')

async function routes (fastify, options) {

    fastify.get('/', async (req, rep) => {
        return { hello: 'world' }
    })

    /**
     * Search a track/album/artist... in deezer
     * @body {string} query The title to search
     * @body {string} type The type of the element : track/album...
     * @param {number} limit Number of elements
     */
    fastify.post('/search', async (req, rep) => {
        let query = req.body.query;
        let type = req.body.type;

        let res = await axios({
            method: 'get',
            url: `https://api.deezer.com/search/${type}?q=${query}&limit=${req.query.limit ? parseInt(req.query.limit) : 1}`
        })

        rep.send(res.data.data)
    })

    /**
     * Get all info of a music from deezer
     * @body {string} musicID The musicID of the music
     */
    fastify.post('/music', async (req, rep) => {
        let results = await deezer(`https://www.deezer.com/track/${req.body.musicID}`);
        rep.send(results)
    })

    /**
     * Get the Trend playlist
     * @body {string} musicID The musicID of the music
     */
    fastify.get('/trend', async (req, rep) => {
        let results = await deezer(`https://www.deezer.com/en/playlist/53362031`);
        rep.send(results)
    })
}

module.exports = routes;
