const dotenv = require('dotenv').config().parsed;
const { PrismaClient } = require('@prisma/client')

const fastify = require('fastify')({
    logger: false,
    trustProxy: true
});

// CORS
fastify.register(require('fastify-cors'), {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
});

const prisma = new PrismaClient()
fastify.decorate('db', prisma);

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

fastify.listen(process.env.PORT, '0.0.0.0').then(() => {
    console.log(`Server listening.. PORT: ${process.env.PORT}`)
})

module.exports = fastify;
