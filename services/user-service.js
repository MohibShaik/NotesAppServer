const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const auth = require('../helpers/jwt.js');

async function login(emailAddress, password) {
  const user = await User.findOne({ emailAddress });
  console.log(user)
  // synchronously compare user entered password with hashed password
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(emailAddress);
      // call toJSON method applied during model instantiation
      return { status: 200, user: user.toJSON(), accessToken: token };
    } else {
      return { status: 403, message: 'Invalid credentials' };
    }
  } else {
    return { status: 404, message: 'user not found' };
  }
}

async function register(params) {
  // instantiate a user modal and save to mongoDB
  const user = new User(params);
  await user.save();
}

async function getById(id) {
  const user = await User.findById(id);
  // call toJSON method applied during model instantiation
  return user.toJSON();
}

module.exports = {
  login,
  register,
  getById,
};
