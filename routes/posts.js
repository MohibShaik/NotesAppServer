const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Post = require('../models/posts');
const jwt = require('../helpers/jwt');
const multer = require('multer');
const Aws = require('aws-sdk');
require('custom-env').env('development');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
});

// below variable is define to check the type of file which is uploaded
const filefilter = (req, file, cb) => {
  const isValid = MIME_TYPE_MAP[file.mimetype];
  let error = new Error('Invalid mime type');
  if (isValid) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// defining the upload variable for the configuration of photo being uploaded
const upload = multer({
  storage: storage,
  fileFilter: filefilter,
});

// Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET, // secretAccessKey is also store in .env file
});

// now how to handle the post request and to upload photo (upload photo using the key defined below in upload.single ie: profile )
router.post('/', upload.single('profile'), (req, res) => {
  console.log(req.file, 'Hiiiiii');

  // Definning the params variable to uplaod the photo
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // bucket that we made earlier
    Key: req.file.originalname, // Name of the image
    Body: req.file.buffer, // Body which will contain the image in buffer format
    ACL: 'public-read-write', // defining the permissions to get the public link
    ContentType: 'image/jpeg', // Necessary to define the image content-type to view the photo in the browser with the link
  };

  // uplaoding the photo using s3 instance and saving the link in the database.
  s3.upload(params, (error, data) => {
    if (error) {
      console.log(error, 'upload failed to s3');
      res.status(500).send({ err: error }); // if we get any error while uploading error message will be returned.
    }

    // If not then below code will be executed
    console.log(data, 'img uploaded to s3', req.body); // this will give the information about the object in which photo is stored

    // saving the information in the database.
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: data.Location,
      userId: req.body.userId,
      postDate: req.body.postDate,
    });
    newPost
      .save()
      .then((result) => {
        res.status(200).send({
          _id: result._id,
          title: result.title,
          content: result.content,
          imagePath: data.Location,
        });
      })
      .catch((err) => {
        res.send({ message: err });
      });
  });
});

router.post('/:id/like', getPostsById, async (req, res) => {
  try {
    res.posts.likes.push(req.body);
    const updatedPosts = await res.posts.save();
    data = await updatedPosts.populate('likes.userId');
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post(
  '/:id/comment',
  getPostsById,
  async (req, res) => {
    try {
      res.posts.comments.push(req.body);
      const updatedPosts = await res.posts.save();
      data = await updatedPosts.populate('comments.userId');
      res.status(200).json(data);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId').populate('comments.userId').populate('likes.userId');
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
