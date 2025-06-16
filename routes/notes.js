const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

router.post('/', async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
});

router.get("/", async (req, res) => {
    const { q, tags, match } = req.query;

    let filter = {};

    if (q) {
        filter.$or = [
            { title: new RegExp(q, "i") },
            { content: new RegExp(q, "i") }
        ];
    }

    if (tags) {
        const tagArray = tags.split(",").map(tag => tag.trim());

        if (match === "all") {
            filter.tags = { $all: tagArray };
        } else {
            filter.tags = { $in: tagArray };
        }
    }

    try {
        const notes = await Note.find(filter);
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.delete('/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ error: "Invalid request" });
    }
});

module.exports = router;