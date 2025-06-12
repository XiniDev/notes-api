const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

router.post('/', async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
});

router.get('/', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

router.delete('/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

module.exports = router;