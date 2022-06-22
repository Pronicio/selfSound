async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Get infos about the user
     */
    fastify.route({
        method: 'GET',
        url: '/me',
        preHandler: async (req, reply, done) => {
            await req.jwtVerify()
            done()
        },
        handler: async (req, rep) => {
            const user = await db.getUser({
                username: req.user.username
            })

            rep.send({
                username: user.username,
                email: user.email,
                locale: user.locale,
                avatar: user.avatar,
            })
        }
    })
}

module.exports = routes;
