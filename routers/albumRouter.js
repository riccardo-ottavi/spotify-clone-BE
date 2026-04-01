const express = require("express");

const albumController = require('../controllers/albumController');

const router = express.Router();

router.get('/', albumController.index)

router.get('/:id', albumController.show)

module.exports = router;