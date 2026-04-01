const songs = require('../data/songs')

function index(req, res) {
    res.json(songs);
}

function show(req, res) {
    const id = Number(req.params.id);
    const song = songs.find(s => s.id === id);
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
}

module.exports = { index, show }