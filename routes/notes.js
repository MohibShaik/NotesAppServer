const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const noteModel = require('../models/notes');

// get all notes by user id
router.get('/:user_id/notes_list', async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.params.user_id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a new note
router.post('/', async (req, res) => {
  console.log(req.body);
  const note = new noteModel({
    userId: req.body.userId,
    title: req.body.title,
    label: req.body.label,
    category: req.body.category,
    description: req.body.description,
  });
  try {
    const newNotes = await note.save();
    res.status(201).json(newNotes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get one by id
router.get('/:id', getNotes, async (req, res) => {
  res.status(200).json(res.notes);
});

// update a note by id
router.patch('/:id', getNotes, async (req, res) => {
  res.notes.title = req.body.title;
  res.notes.description = req.body.description;

  try {
    const updatedNotes = await res.notes.save();
    res.status(200).json(updatedNotes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a note by id
router.delete('/:id', getNotes, async (req, res) => {
  try {
    await res.notes.remove();
    res.status(200).json({ message: 'notes deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// middleware function
async function getNotes(req, res, next) {
  let notes;
  try {
    console.log(req.params.id);
    notes = await noteModel.findById(req.params.id);
    console.log(notes);
    if (notes == null) {
      return res
        .status(404)
        .json({ message: 'cannot find notes with provided id' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.notes = notes;
  next();
}
module.exports = router;
