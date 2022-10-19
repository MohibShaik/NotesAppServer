const express = require('express');
const router = express.Router();
const jwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config();
const notificationController = require('../controllers/notification-controller');

router.post('/notification', notificationController.send);

module.exports = router;