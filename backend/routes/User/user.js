async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Get infos about the user
     */
    fastify.get('/me', async function (req, rep) {
        await req.jwtVerify()

        const user = await db.getUser({
            username: req.user.username
        })

        const lib = await db.getUserLib({
            username: req.user.username
        })

        rep.send({
            username: user.username,
            email: user.email,
            locale: user.locale,
            avatar: user.avatar,
            library: { ...lib }
        })
    })
}

module.exports = routes;
