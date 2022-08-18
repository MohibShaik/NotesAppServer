const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Post = require('../models/posts');
const jwt = require('../helpers/jwt');
const dotenv = require('dotenv');
dotenv.config();
const app = express();



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const fileupload = require('express-fileupload');
app.use(fileupload({ useTempFiles: true }))


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Feeds',
  },
});

const parser = multer({ storage: storage });

router.post('/upload', jwt.authenticateToken, async (req, res) => {
  try {
    const fileStr = req.body.image;
    const uploadResponse = await cloudinary.uploader.upload(fileStr,
      { folder: 'Feeds' });
    if (uploadResponse.url) {

      const newPost = new Post({
        content: req.body.content,
        imagePath: uploadResponse.secure_url,
        userId: req.body.userId,
        postDate: req.body.postDate,
      });

      await newPost
        .save()
        .then((result) => {
          res.status(200).json({ message: "Post created successfully", data: result });
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });

    }
    // res.json({ msg: 'yaya' });
  } catch (err) {
    res.status(500).json({ message: err });
  }

});


router.post('/:id/like', jwt.authenticateToken, getPostsById, async (req, res) => {
  try {
    res.posts.likes.push(req.body);
    const updatedPosts = await res.posts.save();
    data = await updatedPosts.populate('likes.userId');
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


router.post('/:id/unlike', jwt.authenticateToken, getPostsById, async (req, res) => {
  try {
    res.posts.likes.splice(res.posts.likes.findIndex(like => like.userId === req.body.userId), 1);
    const updatedPosts = await res.posts.save();
    const data = await updatedPosts.populate('likes.userId');
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


router.post(
  '/:id/comment',
  jwt.authenticateToken,
  getPostsById,
  async (req, res) => {
    try {
      res.posts.comments.push(req.body);
      const updatedPosts = await res.posts.save();
      result = await updatedPosts.populate('comments.userId');
      res.status(200).json({ message: "Comment added successfully", data: result });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
);

router.get('/', jwt.authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find().populate('userId').populate('comments.userId').populate('likes.userId');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/user/:userId', jwt.authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).populate('userId').populate('comments.userId').populate('likes.userId');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


async function getPostsById(req, res, next) {
  let posts;
  try {
    posts = await Post.findById(req.params.id);
    if (posts == null) {
      return res.status(404).json({
        message: 'cannot find posts with provided id',
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.posts = posts;
  next();
}

module.exports = router;
