const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get password vars from .env file
dotenv.config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Forbidden error due to accesstoken , Please login',
        status: 403,
      });
    }

    req.user = user;
    next();
  });
}

function generateAccessToken(username) {
  return jwt.sign({ data: username }, process.env.TOKEN_SECRET, {
    expiresIn: '365d',
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
