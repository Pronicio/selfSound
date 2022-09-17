const CryptoJS = require('crypto-js');

module.exports = async (req, fastify) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decodeB64 = Buffer.from(token, 'base64').toString('ascii')
        const decrypted = CryptoJS.AES.decrypt(decodeB64, process.env.TOKEN);

        const human = decrypted.toString(CryptoJS.enc.Utf8);
        return fastify.jwt.decode(human)
    } catch (e) {
        //console.error(e)
    }
};
