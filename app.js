const express = require("express");
const cors = require("cors");
const path = require("path"); // <-- aggiunto
require('dotenv').config();

const songRouter = require('./routers/songRouter');
const artistRouter = require('./routers/artistRouter');
const albumRouter = require('./routers/albumRouter');
const playlistRouter = require('./routers/playlistRouter');
const uploadRouter = require('./routers/uploadRouter');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET','POST','PATCH','DELETE'],
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/songs', songRouter);
app.use('/artists', artistRouter);
app.use('/albums', albumRouter);
app.use('/playlists', playlistRouter);
app.use('/upload', uploadRouter);  

// Static files
app.use('/audio', express.static('audio'));
app.use('/images', express.static('images'));

// Servi tutti i file top-level statici (front-end React)
app.use((req, res, next) => {
  // se la richiesta non è per /api o /static
  if (!req.path.startsWith('/songs') &&
      !req.path.startsWith('/artists') &&
      !req.path.startsWith('/albums') &&
      !req.path.startsWith('/playlists') &&
      !req.path.startsWith('/upload') &&
      !req.path.startsWith('/audio') &&
      !req.path.startsWith('/images')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});