const express = require('express');

const readingController = require('../controllers/readingController');

const router = express.Router();

router.post('/', readingController.postReading);

router.get('/:readingId', readingController.getReading);

module.exports = router;