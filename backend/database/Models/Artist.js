const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, required: true },
    imageCode: { type: String }
});

module.exports = mongoose.model('Artist', ArtistSchema);
