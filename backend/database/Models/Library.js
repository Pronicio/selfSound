const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
    author: String,
    liked: [],
    playlists: [],
    albums: [],
    artists: []
});

module.exports = mongoose.model('Library', LibrarySchema);
