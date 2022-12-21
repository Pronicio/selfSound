const lyricsFinder = require('lyrics-finder');
const Genius = require("genius-lyrics");
const Client = new Genius.Client();

const axios = require("axios");

async function routes(fastify, options) {

    /**
     * Get a music lyrics
     * @body {string} query The title to search
     * @body {string} author The author of the music
     */
    fastify.post('/search', async (req, rep) => {
        const query = req.body.query;
        const artist = req.body.artist;

        let lyrics = await lyricsFinder(artist, query) || false;

        if (lyrics) {
            return rep.send({
                "lyrics": lyrics,
                "provider": "Google"
            })
        }

        const searches = await Client.songs.search(`${query} ${artist}`);

        const songInfo = searches[0];
        lyrics = await songInfo.lyrics();

        return rep.send({
            "id": songInfo.id,
            "url": songInfo.url,
            "image": songInfo.image,
            "lyrics": lyrics,
            "provider": "Genius"
        })
    })
}

module.exports = routes;
