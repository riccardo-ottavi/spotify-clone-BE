const express = require("express");
const cors = require("cors");

const songRouter = require('./routers/songRouter');
const artistRouter = require('./routers/artistRouter');
const albumRouter = require('./routers/albumRouter');
const playlistRouter = require('./routers/playlistRouter');
const uploadRouter = require('./routers/uploadRouter');


const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET','POST','PATCH','DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/songs', songRouter);
app.use('/artists', artistRouter);
app.use('/albums', albumRouter);
app.use('/playlists', playlistRouter);
app.use('/upload', uploadRouter);  

app.use('/audio', express.static('audio'));
app.use('/images', express.static('images'));


app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});