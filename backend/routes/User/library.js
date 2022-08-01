const { verifyMusic, verifPlaylist, verifAlbum, verifArtist } = require('../../resources/verifyContent')

async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Get the library of the user
     */
    fastify.get('/me', async function (req, rep) {
        await req.jwtVerify()

        const lib = await db.getUserLibrary({
            username: req.user.username
        })

        return rep.send(lib)
    })

    /**
     * Create a playlist / Integrate albums... in the library of the user
     * @body {string} action The name of the action
     * @body {object} data The content of the action
     */
    fastify.post('/me', async function (req, rep) {
        await req.jwtVerify()

        const action = req.body.action;
        const data = req.body.data;

        const actionInDb = await db.createInUserLibrary(req.user.username, action, data)

        if (!actionInDb) {
            return rep.send({ error: true })
        }

        return rep.send(actionInDb)
    })

    /**
     * Put a music in the library of the user
     * @body {string} action The name of the action
     * @body {object} data The content of the action
     */
    fastify.put('/me', async function (req, rep) {
        await req.jwtVerify()

        const action = req.body.action;
        const data = req.body.data;

        if (action === "liked") {
            const trackData = await verifyMusic(data)
            if (!trackData) return rep.send({ error: true })

            const res = await db.addLiked({ username: req.user.username }, trackData)

            if (!res) return rep.send({ error: true })
            return rep.send(trackData)
        }
    })

    /**
     * Delete a music / playlist... in the library of the user
     * @body {string} action The name of the action
     * @body {object} data The content of the action
     */
    fastify.delete('/me', async function (req, rep) {
        await req.jwtVerify()

        const action = req.body.action;
        const data = req.body.data;

        const actionInDb = await db.deleteInUserLibrary(req.user.username, action, data)

        if (!actionInDb) {
            return rep.send({ error: true })
        }

        return rep.send(actionInDb)
    })
}

module.exports = routes;
