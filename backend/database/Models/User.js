const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    locale: { type: String, default: 'en', },
    biography: { type: String, default: null, },
    avatar: { type: String, default: null, },
    createdAt: { type: Date, default: Date.now },
    oauth2: {
        discord: { type: Boolean, default: false }
    },
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
});

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};

UserSchema.options.toObject.transform = function (doc, ret, options) {
    delete ret._id;
    return ret;
}

module.exports = mongoose.model('User', UserSchema);
