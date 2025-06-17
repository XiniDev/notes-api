require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRoutes);
app.use('/api/auth', authRoutes);

// for checking server status
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});
