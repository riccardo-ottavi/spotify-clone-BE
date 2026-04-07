const express = require('express');
const router = express.Router();
const controller = require('../controllers/playlistController');

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/:id/songs', controller.getSongs);
router.post('/:id/songs', controller.addSong); 
router.patch('/:id', controller.update);
router.delete('/:id/songs/:songId', controller.removeSong);

module.exports = router;