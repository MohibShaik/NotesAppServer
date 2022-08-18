const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');
const authController = require('../controllers/auth-controller');

// register new user
router.post('/signup', authController.signUpUser);
router.post('/verify', authController.verifyEmail);
router.post('/update-password', authController.updatePassword);
router.put('/update-user-info', authController.updateUserInfo);
router.post('/update-user-avator', authController.updateUserAvator);


// router.post('/login', authController.updatePassword);



// login api
router.post('/login', async (req, res) => {
  const emailAddress = req.body.emailAddress;
  const password = req.body.password;
  userService
    .login(emailAddress, password)
    .then((response) => {
      res.status(response?.status).json(response);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
