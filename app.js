const express = require("express");
const cors = require("cors");
const songRouter = require('./routers/songRouter');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/songs', songRouter);
app.use('/audio', express.static('audio'));
app.use('/images', express.static('images'));



app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});