const express = require('express');
const multer = require('multer');
const { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById } = require('../controllers/music.controller');
const { authMiddleware, authUser ,  } = require('../middlewares/auth.middlewares');

const router = express.Router();

// Store file in memory so we can upload buffer to ImageKit
const upload = multer({ storage: multer.memoryStorage() });


router.get("/albums" , authMiddleware, getAllAlbums)
router.get("/albums/:id", authMiddleware, getAlbumById)
router.get('/', authMiddleware, getAllMusics);
router.post('/upload', authMiddleware ,upload.any(), createMusic);
router.post('/album', authMiddleware , createAlbum);

module.exports = router;
