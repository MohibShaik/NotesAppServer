const express = require('express');
const { default: mongoose } = require('mongoose');
const Post = require('../models/posts');
const dotenv = require('dotenv');
dotenv.config();
const Pusher = require('pusher');
const cloudinary = require('cloudinary').v2;
const UserModel = require('../models/user-model');
const Favourites = require('../models/favourites');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  encrypted: process.env.PUSHER_APP_SECURE,
  cluster: process.env.PUSHER_APP_CLUSTER,
});

// middleware function
async function getPostsById(postId) {
  const postData = await Post.findById(postId);
  if (!postData) {
    return false;
  }
  return postData;
}

uploadNewFeed = async (req, res) => {
  try {
    const fileStr = req.body.image;
    const uploadResponse = await cloudinary.uploader.upload(
      fileStr,
      {
        folder: 'Feeds',
      }
    );
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
          updateFeedToPusher(
            'Feeds-development',
            'Feeds',
            result
          );
          res.status(200).json({
            message: 'Post created successfully',
            data: result,
          });
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    }
    // res.json({ msg: 'yaya' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

function updateFeedToPusher(channel, event, data) {
  try {
    pusher.trigger(channel, event, {
      data,
    });
  } catch (error) {
    return error;
  }
}

likeAFeed = async (req, res) => {
  try {
    const feedData = await getPostsById(req.params.id);
    if (feedData) {
      feedData.likes.push(req.body);
      const updatedPosts = await feedData.save();
      data = await updatedPosts.populate('likes.userId');
      res.status(200).json({
        message: 'post updated successfully',
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

unLikeAFeed = async (req, res) => {
  try {
    const feedData = await getPostsById(req.params.id);
    if (feedData) {
      feedData.likes.splice(
        feedData.likes.findIndex(
          (like) => like.userId === req.body.userId
        ),
        1
      );
      const updatedPosts = await feedData.save();
      const data = await updatedPosts.populate(
        'likes.userId'
      );
      res.status(200).json({
        message: 'post updated successfully',
        data: data,
      });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

addAComment = async (req, res) => {
  try {
    const feedData = await getPostsById(req.params.id);
    if (feedData) {
      feedData.comments.push(req.body);
      const updatedPosts = await feedData.save();
      result = await updatedPosts.populate(
        'comments.userId'
      );
      res.status(200).json({
        message: 'Comment added successfully',
        data: result,
      });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

getAllFeeds = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId')
      .populate('comments.userId')
      .populate('likes.userId');
    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

getAllFeedsByUserId = async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
    })
      .populate('userId')
      .populate('comments.userId')
      .populate('likes.userId');

    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

addFavourites = async (req, res) => {
  try {
    const favData = new Favourites({
      postId: req.body.postId,
      userId: req.body.userId,
      actionDate: Date.now,
    });
    const updatedUserFav = await favData.save();
    res.status(200).json({
      message: 'Favourites added successfully'
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

getFavouritesByUserId = async (req, res) => {
  try {
    const userFavourites = await Favourites.find({
      userId: req.params.userId,
    }).exec();
    res.status(200).json({
      data: userFavourites ? userFavourites : [],
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

deleteFavourites = async (req, res) => {
  try {
    const userFavourites = await Favourites.findOneAndDelete({
      postId: req.body.postId,
    }).exec();
    res.status(200).json({
      message: 'Favourites removed successfully'
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  uploadNewFeed,
  likeAFeed,
  unLikeAFeed,
  addAComment,
  getAllFeeds,
  getAllFeedsByUserId,
  addFavourites,
  getFavouritesByUserId,
  deleteFavourites,
};
