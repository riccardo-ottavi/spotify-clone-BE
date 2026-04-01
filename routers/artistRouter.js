const express = require("express");

const artistController = require('../controllers/artistController');

const router = express.Router();

router.get('/', artistController.index)

router.get('/:id', artistController.show)

module.exports = router;