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
     * Get the library of the user
     * @body {number} action The name of the action
     * @body {number} data The content of the action
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
}

module.exports = routes;
