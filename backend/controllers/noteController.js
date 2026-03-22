const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all notes
// @route   GET /api/notes
const getNotes = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = {};

  if (search) {
    filter = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    };
  }

  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.json({ success: true, count: notes.length, data: notes });
});

// @desc    Get single note
// @route   GET /api/notes/:id
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json({ success: true, data: note });
});

// @desc    Create note
// @route   POST /api/notes
const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json({ success: true, data: note });
});

// @desc    Update note
// @route   PUT /api/notes/:id
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json({ success: true, data: note });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json({ success: true, message: 'Note deleted successfully' });
});

module.exports = { getNotes, getNote, createNote, updateNote, deleteNote };
