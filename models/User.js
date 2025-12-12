const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    full_name: String, 
    menu_code: String,
    dashboard_code: String
});

module.exports = mongoose.model('User', userSchema);
