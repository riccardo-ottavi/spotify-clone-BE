const express = require("express");

const songController = require('../controllers/songController');

const router = express.Router();

router.get('/', songController.index)

router.get('/:id', songController.show)

module.exports = router;