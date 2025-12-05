const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true, unique: true},
    expiresAt: {type: Date, default: () => Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} //30 days
});

module.exports = mongoose.model('Token', tokenSchema);