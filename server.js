const express = require('express');
const mongoose = require('mongoose');
const notesRoutes = require('./routes/notes');

const app = express();
app.use(express.json());
app.use('/api/notes', notesRoutes);

mongoose.connect('mongodb://mongo:27017/notesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(err => console.error(err));
