const express = require("express");

const playlistController = require('../controllers/playlistController');

const router = express.Router();

router.get('/', playlistController.index)

router.get('/:id', playlistController.show)

router.post('/', playlistController.create);

router.patch('/:id', playlistController.update);

router.delete('/:id', playlistController.destroy);

module.exports = router;