const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    providerId: { type: Number },
    youtubeId: { type: String },
    name: { type: String, required: true },
    imageCode: { type: String },
    creator: { type: Object },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
