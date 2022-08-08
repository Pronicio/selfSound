const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    id: { type: Number },
    title: { type: String, required: true },
    imageCode: { type: String }
});

module.exports = mongoose.model('Album', AlbumSchema);
