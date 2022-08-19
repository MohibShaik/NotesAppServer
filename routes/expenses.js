const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const ExpensesModel = require('../models/expenses-model');
const jwt = require('../helpers/jwt');

// get all expenses
router.get('/:userId', jwt.authenticateToken, async (req, res) => {
  try {
    const expenses = await ExpensesModel.find({ userId: req.params.userId });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a new expense
router.post('/', async (req, res) => {
  const expense = new ExpensesModel({
    userId: req.body.userId,
    categoryId: req.body.category,
    amount: req.body.amount,
    name: req.body.name,
  });
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get one by id
router.get('/:id', jwt.authenticateToken, getExpenses, async (req, res) => {
  res.status(200).json(res.expenses);
});

// update a expense by id
router.patch('/:id', jwt.authenticateToken, getExpenses, async (req, res) => {
  res.expenses.amount = req.body.amount;
  res.expenses.name = req.body.name;
  res.expenses.categoryId = req.body.categoryId;

  try {
    const updatedExpense = await res.expenses.save();
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a note by id
router.delete('/:id', jwt.authenticateToken, getExpenses, async (req, res) => {
  try {
    await res.expenses.remove();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// middleware function
async function getExpenses(req, res, next) {
  let expenses;
  try {
    expenses = await ExpensesModel.findById(req.params.id);
    if (expenses == null) {
      return res
        .status(404)
        .json({ message: 'cannot find expenses with provided id' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.expenses = expenses;
  next();
}
module.exports = router;
