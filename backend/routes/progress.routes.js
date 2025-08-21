const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const {
  getAllProgress,
  addProgress,
  updateProgress,
  deleteProgress
} = require('../controllers/progress.controller');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET /progress - Get all progress cards (requires auth)
router.get('/', authMiddleware, getAllProgress);

// POST /progress/add - Add new progress card (admin only)
router.post('/add', authMiddleware, adminMiddleware, upload.array('images', 5), addProgress);

// PUT /progress/update/:id - Update progress card (admin only)
router.put('/update/:id', authMiddleware, adminMiddleware, upload.array('images', 5), updateProgress);

// DELETE /progress/delete/:id - Delete progress card (admin only)
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProgress);

module.exports = router;
