const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const labelService = require('../services/label-service');
const auth = require('../helpers/jwt.js');
const labelModel = require('../models/label-model');
const jwt = require('../helpers/jwt');

// login api
router.post('/', async (req, res) => {
  labelService
    .createLabel(req.body)
    .then((response) => {
      res.status(response?.status).json(response);
    })
    .catch((err) => res.status(500).json(err));
});

router.get('/', async (req, res) => {
  labelService
    .findAll()
    .then((response) => {
      res.status(response?.status).json(response);
    })
    .catch((err) => {
      res.status(response?.status).json(response);
    });
});

router.get('/:id', async (req, res) => {
  labelService
    .findById(req.params.id)
    .then((response) => res.status(response?.status).json(response))
    .catch((err) => {
      res.status(response?.status).json(response);
    });
});

// update a note by id
router.patch('/:id', getLabel, async (req, res) => {
  res.label.name = req.body.name;
  res.label.description = req.body.description;

  try {
    const updatedLabel = await res.label.save();
    res.status(200).json(updatedLabel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a note by id
router.delete('/:id', getLabel, async (req, res) => {
  try {
    await res.label.remove();
    res.status(200).json({ message: 'label deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// middleware function
async function getLabel(req, res, next) {
  let label;
  try {
    label = await labelModel.findById(req.params.id);
    if (label == null) {
      return res
        .status(404)
        .json({ message: 'cannot find label with provided id' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.label = label;
  next();
}

module.exports = router;
