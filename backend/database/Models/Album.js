const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    providerId: { type: Number },
    youtubeId: { type: String },
    title: { type: String, required: true },
    imageCode: { type: String }
});

module.exports = mongoose.model('Album', AlbumSchema);
