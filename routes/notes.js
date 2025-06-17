const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const note = new Note({ ...req.body, userId: req.user.id });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ error: 'Invalid note data' });
    }
});

router.get('/', auth, async (req, res) => {
    const { q, tags, match } = req.query;

    let filter = { userId: req.user.id };

    if (q) {
        filter.$or = [
            { title: new RegExp(q, 'i') },
            { content: new RegExp(q, 'i') }
        ];
    }

    if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());

        if (match === 'all') {
            filter.tags = { $all: tagArray };
        } else {
            filter.tags = { $in: tagArray };
        }
    }

    try {
        const notes = await Note.find(filter);
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!note) return res.status(404).json({ error: 'Note not found' });

        res.json(note);
    } catch (err) {
        res.status(400).json({ error: 'Invalid request' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!note) return res.status(404).json({ error: 'Note not found' });

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

module.exports = router;