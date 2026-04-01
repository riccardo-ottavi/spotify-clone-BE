// importo il framework express
const express = require("express");

// importiamo il controller
const bookController = require('../controllers/bookController');

// import middleware di gestione file
const upload = require('../middlewares/multer');

// settiamo il router
const router = express.Router();

// index
router.get('/', bookController.index)

// show
router.get('/:id', bookController.show)

// Store reviews
router.post('/:id/reviews', bookController.storeReview)

// Store book
router.post('/', upload.single('image'), bookController.store)

module.exports = router;