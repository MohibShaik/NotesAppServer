const { generateOTP } = require('../services/otp-service');
const { sendMail } = require('../services/email-service');
const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;


module.exports.signUpUser = async (req, res) => {
  const { username, emailAddress, password } = req.body;
  const isExisting = await findUserByEmail(emailAddress);

  if (isExisting) {
    return res
      .status(400)
      .json({ message: 'User already exists' });
  }

  // create new user
  const newUser = await createUser(
    username,
    emailAddress,
    password
  );

  if (!newUser[0]) {
    return res.status(400).send({
      message: 'Unable to create new user',
    });
  }

  return res.status(201).send({
    message: 'User created successfully',
    data: newUser,
  });
};

module.exports.verifyEmail = async (req, res) => {
  const { emailAddress, otp } = req.body;
  const user = await validateUserSignUp(emailAddress, otp);
  res.send(user);
};

module.exports.updatePassword = async (req, res) => {
  const { emailAddress, password } = req.body;
  const userData = await UserModel.findOne({
    emailAddress,
  });

  if (userData) {
    let updatedHashedPassword = await bcrypt.hash(
      password,
      10
    );

    const updatedUser = await UserModel.findByIdAndUpdate(
      userData._id,
      {
        $set: { password: updatedHashedPassword },
      }
    );

    if (updatedUser) {
      return res
        .status(200)
        .json({ message: 'Password updated successfully' });
    } else {
      return res.status(500).json({
        message:
          'Something went wrong , please try again later!',
      });
    }
  } else {
    return res
      .status(400)
      .json({ message: 'User not found' });
  }
};

// middleware functions
const findUserByEmail = async (emailAddress) => {
  const user = await UserModel.findOne({
    emailAddress,
  });
  if (!user) {
    return false;
  }
  return user;
};

const createUser = async (
  username,
  emailAddress,
  password
) => {
  let hashedPassword = await bcrypt.hash(password, 10);

  const otpGenerated = generateOTP();

  const newUser = await UserModel.create({
    username: username,
    emailAddress: emailAddress,
    password: hashedPassword,
    otp: otpGenerated,
  });

  if (!newUser) {
    return [
      false,
      'Something went wrong while creation of account',
    ];
  }

  try {
    await sendMail({
      to: emailAddress,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    return [
      false,
      'Unable to sign up, Please try again later',
      error,
    ];
  }
};

const validateUserSignUp = async (emailAddress, otp) => {
  const user = await UserModel.findOne({
    emailAddress,
  });
  if (!user) {
    return { message: 'User not found' };
  }
  if (user && user.otp !== otp) {
    return { message: 'Invalid OTP' };
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    {
      $set: { active: true },
    },
    { new: true }
  );
  return {
    message:
      'Your Email Address is successfully verified , Please login to access your account',
    data: updatedUser,
  };
};

// update user info call
module.exports.updateUserInfo = async (req, res) => {
  const userId = req.body.id;
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        username: req.body.username,
        emailAddress: req.body.emailAddress,
      },
    }
  );

  if (updatedUser) {
    res.status(200).json({
      message: 'User Profile Updated Successfully',
      data: updatedUser,
    });
  } else {
    return res
      .status(400)
      .json({ message: 'User not found' });
  }
};

// update user info call
module.exports.updateUserAvator = async (req, res) => {
  try {
    if (req.files.length) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            imagePath: req.files[0].path,
          },
        },
        { new: true }
      );
      if (updatedUser) {
        res.status(200).json({
          message: 'User Profile Updated Successfully',
          data: updatedUser,
        });
      } else {
        return res.status(400).json({
          message:
            'Something went wrong , Please try again later',
        });
      }
    }
  } catch (e) {
    return res.status(400).json({
      message:
        'Something went wrong , Please try again later',
    });
  }
};

// login call
module.exports.login = async (req, res) => {
  const emailAddress = req.body.emailAddress;
  const password = req.body.password;
  const user = await UserModel.findOne({ emailAddress });
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
};
