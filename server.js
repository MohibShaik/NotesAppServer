const express = require('express');
const app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();

// routes
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const labelRoutes = require('./routes/labels');
const expensesRoutes = require('./routes/expenses');
const postsRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notification');
const budgetRoutes = require('./routes/budget');
const transactionRoutes = require('./routes/transactions');
const authMiddleware = require("./middleware/auth-middleware");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/notes', notesRoutes);
app.use('/users', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/labels', labelRoutes);
app.use('/posts', postsRoutes);
app.use('/admin', notificationRoutes);
app.use('/budget', budgetRoutes);
app.use('/transactions', transactionRoutes);
app.use("/", authMiddleware);

// DB config
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () =>
  console.log('connected to db server')
);

// simple route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to M'Feeds Server application.",
  });
});

const notification_options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
};

// set port, listen for requests
const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
