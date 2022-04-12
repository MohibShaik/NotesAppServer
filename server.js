
const express = require('express');
const app = express();

var cors = require("cors");
app.use(cors());

const mongoose = require('mongoose');
require ('custom-env').env('production')
console.log(process.env.APP_ENV);
console.log(process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to db server'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');

app.use('/notes', notesRoutes);
app.use('/users', authRoutes);

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NotesApp Server application.' });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
