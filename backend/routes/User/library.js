const { verifyMusic, verifPlaylist, verifAlbum, verifArtist } = require('../../resources/verifyContent')

async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Checks the user's token
     */
    fastify.addHook('preHandler', (req, rep, done) => {
        fastify.verifyUser(req, fastify).then(userData => {
            if (!userData) return rep.send({ error: true })

            req.user = userData;
            done()
        })
    })

    /**
     * Get the library of the user
     */
    fastify.get('/me', async function (req, rep) {
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
        const action = req.body.action;
        const data = req.body.data;

        try {
            const actionName = action.charAt(0).toUpperCase() + action.slice(1);
            if (actionName !== "Album" && actionName !== "Artist" && actionName !== "Playlist") {
                return rep.send({ error: true })
            }

            const Data = await eval(`verif${actionName}`)(data);
            if (!Data) return rep.send({ error: true })

            const res = await eval(`db.add${actionName}`)({ username: req.user.username }, Data);

            if (!res) return rep.send({ error: true })
            return rep.send(Data)
        } catch (e) {
            console.error(e)
        }

        rep.send({ error: true })
    })

    /**
     * Put a music in the library of the user
     * @body {string} action The name of the action
     * @body {object} data The content of the action
     */
    fastify.put('/me', async function (req, rep) {
        const action = req.body.action;
        const data = req.body.data;

        if (action === "liked") {
            const trackData = await verifyMusic(data)
            if (!trackData) return rep.send({ error: true })

            const res = await db.addLiked({ username: req.user.username }, trackData)

            if (!res) return rep.send({ error: true })
            return rep.send(trackData)
        }

        rep.send({ error: true })
    })

    /**
     * Delete a music / playlist... in the library of the user
     * @body {string} action The name of the action
     * @body {object} data The content of the action
     */
    fastify.delete('/me', async function (req, rep) {
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
