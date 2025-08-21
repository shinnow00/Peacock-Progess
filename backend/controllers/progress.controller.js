const Progress = require('../models/progress.model');

// Get all progress cards
const getAllProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new progress card
const addProgress = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const newProgress = new Progress({
      title,
      description,
      images,
      isDeleted: false
    });
    
    const savedProgress = await newProgress.save();
    res.status(201).json(savedProgress);
  } catch (error) {
    console.error('Error adding progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update progress card
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const progress = await Progress.findById(id);
    
    if (!progress || progress.isDeleted) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    // Combine existing images with new ones
    const updatedImages = [...progress.images, ...newImages];
    
    const updatedProgress = await Progress.findByIdAndUpdate(
      id,
      { title, description, images: updatedImages },
      { new: true }
    );
    
    res.json(updatedProgress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft-delete progress card
const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const progress = await Progress.findById(id);
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    if (progress.isDeleted) {
      return res.json({ message: 'Progress already deleted' });
    }

    await Progress.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    
    res.json({ message: 'Progress deleted successfully (soft delete)' });
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProgress,
  addProgress,
  updateProgress,
  deleteProgress
};
