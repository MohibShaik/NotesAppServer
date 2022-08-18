const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const auth = require('../helpers/jwt.js');

async function login(emailAddress, password) {
  const user = await User.findOne({ emailAddress });
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
    return { status: 404, message: "Seems like you don't have an account , try creating a new one" };
  }
}

async function register(params) {
  // instantiate a user modal and save to mongoDB
  const user = new User(params);
  await user.save();
}


async function updatePassword(userId , updatePassword) {
  let updatedHashedPassword = await bcrypt.hash(updatePassword, 10);
  User.findOneAndUpdate({_id: userId}, {password: updatedHashedPassword}, function(err, user) {
    console.log(user)
  });
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
