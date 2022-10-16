const express = require('express');
const router = express.Router();
const jwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config();
const feedController = require('../controllers/posts-controller');
const multer = require('multer');
const cloudinaryInit = require('../config/cloudinary.config');

const clodStorage =
  cloudinaryInit.initializeCloudinary('Feeds');
const parser = multer({ storage: clodStorage });

router.post('/upload', parser.any(), feedController.uploadNewFeed);
router.post('/:id/like', jwt.authenticateToken, feedController.likeAFeed);
router.post('/:id/unlike', jwt.authenticateToken, feedController.unLikeAFeed);
router.post('/:id/comment', jwt.authenticateToken, feedController.addAComment);
router.get('/', jwt.authenticateToken, feedController.getAllFeeds);
router.get('/user/:userId', jwt.authenticateToken, feedController.getAllFeedsByUserId);
router.post('/:userId/favourites', feedController.addFavourites);
router.get('/:userId/favourites', feedController.getFavouritesByUserId);
router.post('/:userId/updateFavourites', feedController.deleteFavourites);


module.exports = router;