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
        const query = req.body.query;
        const type = req.body.type;

        const url = `https://api.deezer.com/search/${type}?q=${query}&limit=${req.query.limit ? parseInt(req.query.limit) : 1}`

        const res = await axios({
            method: 'get',
            url: encodeURI(url)
        })

        rep.send(res.data.data)
    })

    /**
     * Get an album
     * @body {string} id The ID of the album
     */
    fastify.post('/album', async (req, rep) => {
        const id = req.body.id;

        const res = await axios({
            method: 'get',
            url: `https://api.deezer.com/album/${id}`
        })

        rep.send(res.data)
    })

    /**
     * Get an artist
     * @body {string} id The ID of the album
     */
    fastify.post('/artist', async (req, rep) => {
        const id = req.body.id;

        const res = await axios({
            method: 'get',
            url: `https://api.deezer.com/artist/${id}`
        })

        rep.send(res.data)
    })

    /**
     * Get an artist
     * @body {string} id The ID of the album
     */
    fastify.post('/artist/:key', async (req, rep) => {
        const id = req.body.id;
        const key = req.params.key

        const res = await axios({
            method: 'get',
            url: `https://api.deezer.com/artist/${id}/${key}?limit=20`
        })

        rep.send(res.data)
    })

    /**
     * Get all info of a music from deezer
     * @body {string} musicID The musicID of the music
     */
    fastify.post('/music', async (req, rep) => {
        const id = req.body.musicID;

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/track/${id}`
        })

        rep.send(results.data)
    })

    /**
     * Get all info of a playlist
     * @body {string} id The ID of the playlist
     */
    fastify.post('/playlist', async (req, rep) => {
        const id = req.body.id;

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/playlist/${id}`
        })

        rep.send(results.data)
    })

    /**
     * Get the Trend playlist
     */
    fastify.get('/trend', async (req, rep) => {
        const results = await axios({
            method: 'get',
            url: `hhttps://www.deezer.com/en/playlist/53362031`
        })

        rep.send(results.data)
    })

    /**
     * Get the Top worldwide playlist
     * @param {number} limit Number of elements
     * @param {number} index The index of the page
     */
    fastify.get('/top_world', async (req, rep) => {
        const indexText = req.query.index ? `&index=${req.query.index}` : ''

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/playlist/3155776842/tracks?limit=${req.query.limit ? parseInt(req.query.limit) : 1}${indexText}`
        })

        rep.send(results.data)
    })

    /**
     * Get all info of a user / artist
     * @body {string} id The ID of the user
     */
    fastify.post('/profile', async (req, rep) => {
        const id = req.body.id;

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/user/${id}`
        })

        rep.send(results.data)
    })

    /**
     * Get specified infos of a user / artist
     * @body {string} id The ID of the user
     */
    fastify.post('/profile/:key', async (req, rep) => {
        const id = req.body.id;
        const key = req.params.key

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/user/${id}/${key}?limit=20`
        })

        rep.send(results.data)
    })

    /**
     * Get all genres
     */
    fastify.get('/genres', async (req, rep) => {
        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/editorial`
        })

        rep.send(results.data.data)
    })

    /**
     * Get all charts of a genre
     * @body {string} id The ID of the genre
     */
    fastify.post('/genre/charts', async (req, rep) => {
        const id = req.body.id;

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/editorial/${id}/charts`
        })

        rep.send(results.data.tracks)
    })

    /**
     * Get new releases of a genre
     * @body {string} id The ID of the genre
     */
    fastify.post('/genre/releases', async (req, rep) => {
        const id = req.body.id;

        const results = await axios({
            method: 'get',
            url: `https://api.deezer.com/editorial/${id}/releases`
        })

        rep.send(results.data.data)
    })
}

module.exports = routes;
