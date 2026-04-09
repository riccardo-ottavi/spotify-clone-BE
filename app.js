const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const songRouter = require('./routers/songRouter');
const artistRouter = require('./routers/artistRouter');
const albumRouter = require('./routers/albumRouter');
const playlistRouter = require('./routers/playlistRouter');
const uploadRouter = require('./routers/uploadRouter');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Serve static files della build front-end
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, 'dist', 'images')));
app.use('/audio', express.static(path.join(__dirname, 'dist', 'audio')));

// Serve index.html per ogni percorso non gestito
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});