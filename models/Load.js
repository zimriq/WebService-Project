const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id: String,
    display_identifier: String, 
    load_status: String, 
    load_status_label: String,
    order_number: String,
    sort: Number,
    active: Boolean,
    current: Boolean,
});

loadSchema.set('toJSON'), {
    transform: function(doc, ret) {
        ret.id = ret._id; 
        ret.userId = ret.userId; 
        delete ret._id; 
        delete ret.userId; 
    }
}

module.exports = mongoose.model('Load', loadSchema);
