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

        const lib = await db.getUserLibrary({
            username: req.user.username
        })

        /*
        const res = await db.addLiked({ username: user.username }, {
            providerId: 3135553,
            title: "One More Time",
            //providerId: 3135556,
            //title: "Harder, Better, Faster, Stronger",
            imageCode: "2e018122cb56986277102d2041a592c8",
            album: {
                providerId: 302127,
                //title: "Discovery",
                //imageCode: "2e018122cb56986277102d2041a592c8"
            },
            artist: {
                providerId: 27,
                name: "Daft Punk",
                //imageCode: "f2bc007e9133c946ac3c3907ddc5d2ea"
            }
        })

        console.log(res)

         */

        rep.send({
            username: user.username,
            email: user.email,
            locale: user.locale,
            avatar: user.avatar,
            lib
        })
    })
}

module.exports = routes;
