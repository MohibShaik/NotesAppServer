const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const budgetModel = require('../models/budget-model');
const jwt = require('../helpers/jwt');

router.get('/', jwt.authenticateToken, async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a new category
router.post('/', async (req, res) => {
  const budget = new budgetModel({
    creator: req.body.userId,
    name: req.body.name,
    isActive: req.body.isActive,
    description: req.body.description,
  });
  try {
    const newBudget = await budget.save();
    res.status(201).json({
      data: newBudget,
      message: 'New Budget created successfully',
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get one by id
router.get(
  '/:id',
  jwt.authenticateToken,
  getCategories,
  async (req, res) => {
    res.status(200).json(res.categories);
  }
);

// update a note by id
router.patch(
  '/:id',
  jwt.authenticateToken,
  getCategories,
  async (req, res) => {
    res.categories.name = req.body.name;
    res.categories.description = req.body.description;

    try {
      const updatedCategory = await res.categories.save();
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// delete a note by id
router.delete(
  '/:id',
  jwt.authenticateToken,
  getCategories,
  async (req, res) => {
    try {
      await res.categories.remove();
      res
        .status(200)
        .json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// middleware function
async function getCategories(req, res, next) {
  let categories;
  try {
    categories = await categoryModel.findById(
      req.params.id
    );
    if (categories == null) {
      return res.status(404).json({
        message: 'cannot find categories with provided id',
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.categories = categories;
  next();
}
module.exports = router;
