const axios = require('axios')

async function routes(fastify, options) {

    const db = fastify.db;

    /**
     * Register a user
     * @body {string} email The email of the user
     * @body {string} username The name of the user
     * @body {string} password The password of the user
     */
    fastify.route({
        method: 'POST',
        url: '/register',
        handler: async (req, rep) => {
            const infos = req.body

            const newUser = await db.register(infos)

            if (newUser) {
                const token = fastify.jwt.sign({
                    username: newUser.username
                })

                return rep.send({
                    error: false,
                    token: token
                })
            }

            return rep.send({error: true})
        }
    })

    /**
     * Login a user
     * @body {string} email The email of the user
     * @body {string} username The name of the user
     * @body {string} password The password of the user
     */
    fastify.route({
        method: 'POST',
        url: '/login',
        handler: async (req, rep) => {
            const infos = req.body

            const User = await db.login(infos)

            if (User) {
                const token = fastify.jwt.sign({
                    username: User.username
                })

                return rep.send({
                    error: false,
                    token: token
                })
            }

            return rep.send({error: true})
        }
    })

    /**
     * Discord oauth2
     * @param {string} code The oauth2 code
     */
    fastify.route({
        method: 'GET',
        url: '/discord',
        handler: async (req, rep) => {
            const discordCode = req.query.code;

            const params = new URLSearchParams()
            params.append('client_id', process.env.DISCORD_CLIENT_ID)
            params.append('client_secret', process.env.DISCORD_CLIENT_SECRET)
            params.append('grant_type', 'authorization_code')
            params.append('code', discordCode)
            params.append('redirect_uri', process.env.DISCORD_REDIRECT)

            const reqConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            const auth = await axios.post("https://discord.com/api/oauth2/token", params, reqConfig);

            const userResult = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${auth.data.token_type} ${auth.data.access_token}`,
                },
            });

            const userData = {
                ...userResult.data,
                avatar: `https://cdn.discordapp.com/avatars/${userResult.data.id}/${userResult.data.avatar}.webp?size=256`,
                discord: true
            }

            const user = await db.oauth2(userData)

            if (user) {
                const token = fastify.jwt.sign({
                    username: user.username
                })

                return rep.send({
                    error: false,
                    token: token
                })
            }

            return rep.send({error: true})
        }
    })
}

module.exports = routes;
