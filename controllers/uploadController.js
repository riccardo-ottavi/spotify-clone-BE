const multer = require('multer');
const path = require('path');

// Configurazione storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Funzione per gestire upload singolo
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const imageUrl = `/images/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('Errore nell\'upload:', err);
    res.status(500).json({ error: 'Errore durante l\'upload del file' });
  }
};

module.exports = { upload, uploadImage };