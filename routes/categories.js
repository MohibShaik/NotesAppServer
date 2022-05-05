const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const categoryModel = require('../models/category-model');
const jwt = require('../helpers/jwt');

// get all categories
router.get('/', jwt.authenticateToken, async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a new category
router.post('/', jwt.authenticateToken, async (req, res) => {
  const category = new categoryModel({
    userId: req.body.userId,
    name: req.body.name,
    description: req.body.description,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get one by id
router.get('/:id', jwt.authenticateToken, getCategories, async (req, res) => {
  res.status(200).json(res.notes);
});

// update a note by id
router.patch('/:id', jwt.authenticateToken, getCategories, async (req, res) => {
  res.notes.name = req.body.name;
  res.notes.description = req.body.description;

  try {
    const updatedNotes = await res.notes.save();
    res.status(200).json(updatedNotes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a note by id
router.delete(
  '/:id',
  jwt.authenticateToken,
  getCategories,
  async (req, res) => {
    try {
      await res.notes.remove();
      res.status(200).json({ message: 'notes deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// middleware function
async function getCategories(req, res, next) {
  let categories;
  try {
    categories = await categoryModel.findById(req.params.id);
    if (categories == null) {
      return res
        .status(404)
        .json({ message: 'cannot find categories with provided id' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.categories = categories;
  next();
}
module.exports = router;
