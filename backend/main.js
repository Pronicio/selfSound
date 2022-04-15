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

fastify.register(require('./routes/youtube'), { prefix: 'youtube' })

fastify.listen(3000).then(() => {
    console.log("Server listening..")
})
