const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require("../config/cloudinary");

// Configurazione storage multer (temporaneo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro file (solo immagini)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo file immagine consentiti'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Funzione upload con Cloudinary
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload su Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "playlists", // opzionale (cartella su Cloudinary)
    });

    // Cancella file locale dopo upload
    fs.unlinkSync(req.file.path);

    // Ritorna URL Cloudinary
    res.status(200).json({
      url: result.secure_url,
    });

  } catch (err) {
    console.error('Errore nell\'upload:', err);
    res.status(500).json({ error: 'Errore durante l\'upload del file' });
  }
};

module.exports = { upload, uploadImage };