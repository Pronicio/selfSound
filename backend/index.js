const dotenv = require('dotenv').config().parsed;
const Database = require("./Database/Database.js");

const fastify = require('fastify')({
    logger: false,
    trustProxy: true
});

// CORS
fastify.register(require('@fastify/cors'), {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
});

fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET,
    sign: {
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
})

const db = new Database(process.env.MONGO_URL);
fastify.decorate('db', db);

fastify.get('/', async function (req, rep) {
    rep.send({
        hello: 'world'
    })
})

fastify.register(require('./routes/deezer'), { prefix: 'standard' })
fastify.register(require('./routes/radio'), { prefix: 'radio' })
fastify.register(require('./routes/lyrics'), { prefix: 'lyrics' })
fastify.register(require('./routes/youtube'), { prefix: 'youtube' })
fastify.register(require('./routes/soundcloud'), { prefix: 'soundcloud' })

fastify.register(require('./routes/User/user'), { prefix: 'users' })
fastify.register(require('./routes/User/auth'), { prefix: 'auth' })

fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }).then(() => {
    console.log(`Server listening.. PORT: ${process.env.PORT}`)
})

module.exports = fastify;
