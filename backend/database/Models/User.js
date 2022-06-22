const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    locale: {
        type: String, default: 'en',
    },
    biography: {
        type: String, default: null,
    },
    avatar: {
        type: String, default: null,
    },
    createdAt: {
        type: Date, default: Date.now
    },
    oauth2: {
        discord: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('User', UserSchema);
