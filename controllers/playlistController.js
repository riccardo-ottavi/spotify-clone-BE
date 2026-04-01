const playlists = require('../data/playlists')

function index(req, res) {
    res.json(playlists);
}

function show(req, res) {
    const id = Number(req.params.id);
    const playlists = playlists.find(s => s.id === id);
    if (!playlists) return res.status(404).json({ message: "playlists not found" });
    res.json(playlists);
}

module.exports = { index, show }