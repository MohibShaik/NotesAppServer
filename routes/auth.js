const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');
const authController = require('../controllers/auth-controller');
const dotenv = require('dotenv');
const jwt = require('../helpers/jwt');
dotenv.config();

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const {
  CloudinaryStorage,
} = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pictures',
  },
});

const parser = multer({ storage: storage });

// register new user
router.post('/signup', authController.signUpUser);
router.post('/verify', authController.verifyEmail);
router.post('/update-password', authController.updatePassword);
router.put('/update-user-info', authController.updateUserInfo);
router.post('/update-user-avator', parser.any(), authController.updateUserAvator);
router.post('/login', authController.login);
router.get('/profile/:userId', authController.userInfo);
router.get('/list',jwt.authenticateToken , authController.usersList);


module.exports = router;
