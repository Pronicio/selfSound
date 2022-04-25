const radios = require('../resources/radios.json')

async function routes (fastify, options) {

    fastify.get('/', async (req, rep) => {
        return { hello: 'world' }
    })

    /**
     * Get all famous french radio
     */
    fastify.get('/french', async (req, rep) => {
        rep.send(radios.french)
    })

    /**
     * Get all dash radio
     */
    fastify.get('/dash', async (req, rep) => {
        rep.redirect('https://dash-api.com/api/v3/allData.php')
    })
}

module.exports = routes;
