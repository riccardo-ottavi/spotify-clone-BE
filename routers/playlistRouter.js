const express = require("express");

const playlistController = require('../controllers/playlistController');

const router = express.Router();

router.get('/', playlistController.index)

router.get('/:id', playlistController.show)

module.exports = router;