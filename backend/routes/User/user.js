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
     * Get infos about the user
     */
    fastify.get('/me', async function (req, rep) {
        const user = await db.getUser({
            username: req.user.username
        })

        rep.send({
            username: user.username,
            email: user.email,
            locale: user.locale,
            avatar: user.avatar
        })
    })
}

module.exports = routes;
