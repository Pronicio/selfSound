async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Get infos about the user
     */
    fastify.get('/me', async function (req, rep) {
        const userData = await fastify.verifyUser(req, fastify)
        if (!userData) return rep.send({ error: true })

        const user = await db.getUser({
            username: userData.username
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
