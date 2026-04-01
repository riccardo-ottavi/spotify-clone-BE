const albums = require('../data/albums')

function index(req, res) {
    res.json(albums);
}

function show(req, res) {
    const id = Number(req.params.id);
    const albums = albums.find(s => s.id === id);
    if (!albums) return res.status(404).json({ message: "albums not found" });
    res.json(albums);
}

module.exports = { index, show }