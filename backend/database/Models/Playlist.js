const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    providerId: { type: Number },
    youtubeId: { type: String },
    name: { type: String, required: true },
    imageCode: { type: String }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
