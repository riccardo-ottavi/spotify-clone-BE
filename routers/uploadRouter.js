// router/uploadRouter.js
const express = require("express");
const { upload, uploadImage } = require("../controllers/uploadController");

const router = express.Router();

// Route per l'upload
router.post("/image", upload.single("image"), uploadImage);

module.exports = router;