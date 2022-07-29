
const express = require('express');
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB config 
const mongoose = require('mongoose');
require ('custom-env').env('development');
mongoose.connect(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL)
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to db server'));


// routes 
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const labelRoutes = require('./routes/labels');
const expensesRoutes = require('./routes/expenses');
const postsRoutes = require('./routes/posts');



app.use('/notes', notesRoutes);
app.use('/users', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/labels', labelRoutes);
app.use('/expenses', expensesRoutes);
app.use('/posts', postsRoutes);




// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NotesApp Server application.' });
});

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log('Hiii');
  console.log(`Server is running on port ${PORT}.`);
});
