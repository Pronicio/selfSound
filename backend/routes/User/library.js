async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Get the library of the user
     */
    fastify.get('/me', async function (req, rep) {
        await req.jwtVerify()

        const userLib = await db.getUserLibrary({
            username: req.user.username
        })

        return rep.send(userLib)
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
            return rep.send({error: true})
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

        const actionInDb = await db.putInUserLibrary(req.user.username, action, data)

        if (!actionInDb) {
            return rep.send({error: true})
        }

        return rep.send(actionInDb)
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
            return rep.send({error: true})
        }

        return rep.send(actionInDb)
    })
}

module.exports = routes;
