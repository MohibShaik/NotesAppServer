const Label = require('../models/label-model');
const auth = require('../helpers/jwt.js');

async function createLabel(data) {
  const newLabelName = data.name;
  const isLabelExists = await Label.findOne({ name: newLabelName });
  if (isLabelExists) {
    return { status: 400, message: 'label already exists' };
  } else {
    const newLabel = new Label(data);
    await newLabel.save();
    return { status: 201, message: 'label created successfully' };
  }
}

async function findAll() {
  try {
    const labels = await Label.find();
    return { status: 200, data: labels };
  } catch (err) {
    return { status: 500, message: err.message };
  }
}

async function findById(labelId) {
  try {
    const labels = await Label.findById(labelId);
    return { status: 200, data: labels };
  } catch (err) {
    return { status: 500, message: err.message };
  }
}

module.exports = {
  createLabel,
  findAll,
  findById,
};
