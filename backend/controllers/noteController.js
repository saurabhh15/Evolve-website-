const Note = require('../models/Note');

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      mentor: req.user.userId,
      mentee: req.params.menteeId
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

exports.addNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const note = new Note({
      mentor: req.user.userId,
      mentee: req.params.menteeId,
      content: content.trim()
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

exports.editNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.mentor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    note.content = req.body.content.trim();
    await note.save();
    res.json(note);
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.mentor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};