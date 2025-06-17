const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { username, password, role, adminSecret } = req.body;

        let userRole = 'user';

        if (role === 'admin') {
            if (adminSecret !== process.env.ADMIN_SECRET) {
                return res.status(403).json({ message: 'Invalid admin secret, cannot register as admin' });
            }
            userRole = 'admin';
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const newUser = new User({
            username,
            password,
            role: userRole,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        await Note.deleteMany({ userId: req.user.id });

        res.json({ message: 'User and notes deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/reset', auth, checkRole('admin'), async (req, res) => {
    try {
        await mongoose.connection.dropDatabase();
        res.json({ message: 'Database dropped and reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

module.exports = router;
