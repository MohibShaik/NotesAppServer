const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('../models/user-model');
const router = express.Router();
const bcrypt = require('bcrypt');
const userService = require('../services/user-service');
const auth = require('../helpers/jwt.js');

// register new user
router.post('/signup', async (req, res) => {
  console.log('hiiii');
  try {
    let userExists = await UserModel.findOne({
      emailAddress: req.body.emailAddress,
    });
    console.log(userExists);
    if (userExists) {
      return res.status(400).json({ message: 'user already exists' });
    } else {
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new UserModel({
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        password: hashedPassword,
      });
      const user = await newUser.save();
      const token = auth.generateAccessToken(req.body.emailAddress);
      res
        .status(201)
        .json({
          message: 'user created successfully',
          user: user,
          accessToken: token,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// login api
router.post('/login', async (req, res) => {
  const emailAddress = req.body.emailAddress;
  const password = req.body.password;
  userService
    .login(emailAddress, password)
    .then((response) => {
      console.log(response)
      res.status(response?.status).json(response);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
