const Genius = require("genius-lyrics");
const Client = new Genius.Client();

async function routes(fastify, options) {

    fastify.get('/', async (req, rep) => {
        return {hello: 'world'}
    })

    /**
     * Get a music lyrics
     * @body {string} query The title to search
     * @body {string} author The author of the music
     */
    fastify.post('/search', async (req, rep) => {
        const query = req.body.query;
        const author = req.body.author;

        let searches = await Client.songs.search(`${query} ${author}`);

        let songInfo = searches[0];
        let lyrics = await songInfo.lyrics();

        rep.send({
            id: songInfo.id,
            url: songInfo.url,
            image: songInfo.image,
            lyrics: lyrics,
            provider: "Genius"
        })
    })
}

module.exports = routes;
