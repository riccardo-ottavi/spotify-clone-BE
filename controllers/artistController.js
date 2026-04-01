const artists = require('../data/artists')

function index(req, res) {
    res.json(artists);
}

function show(req, res) {
    const id = Number(req.params.id);
    const artists = artists.find(s => s.id === id);
    if (!artists) return res.status(404).json({ message: "artists not found" });
    res.json(artists);
}

module.exports = { index, show }