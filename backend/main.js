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

fastify.listen(3000).then(() => {
    console.log("Server listening..")
})
