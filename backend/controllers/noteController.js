const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      mentor: req.user.userId,
      mentee: req.params.menteeId
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

exports.addNote = async (req, res) => {
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
    res.status(500).json({ message: 'Error adding note' });
  }
};

exports.editNote = async (req, res) => {
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
    res.status(500).json({ message: 'Error editing note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.mentor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
};