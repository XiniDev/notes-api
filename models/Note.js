const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        trim: true,
        minlength: [1, 'Title cannot be empty']
    },
    content: { 
        type: String, 
        required: [true, 'Content is required'], 
        trim: true,
        minlength: [1, 'Content cannot be empty']
    },
    tags: [{ 
        type: String, 
        trim: true, 
        lowercase: true 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
