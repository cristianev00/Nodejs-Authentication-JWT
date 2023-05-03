const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const imageController = require('../controllers/image.controller');

router.post('/image', verifyToken, imageController.uploadImage);

module.exports = router;
