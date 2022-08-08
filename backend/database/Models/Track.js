const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
    providerId: { type: Number },
    youtubeId: { type: String },
    title: { type: String, required: true },
    imageCode: { type: String },
    album: {
        id: { type: Number }
    },
    artist: {
        name: { type: String },
        providerId: { type: Number },
        youtubeId: { type: String }
    }
});

module.exports = mongoose.model('Track', TrackSchema);
