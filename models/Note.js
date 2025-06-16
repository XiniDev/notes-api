const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
}, { timestamps : true });

module.exports = mongoose.model('Note', noteSchema);
