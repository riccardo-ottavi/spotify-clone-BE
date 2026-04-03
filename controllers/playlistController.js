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

function create(req, res) {
  const newPlaylist = req.body;
  if (!newPlaylist.name) {
    return res.status(400).json({ message: "nome richiesto" });
  }
  playlists.push(newPlaylist);
  res.status(201).json(newPlaylist);
}

function update(req, res) {
  const id = Number(req.params.id);
  const playlist = playlists.find(p => p.id === id);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  Object.assign(playlist, req.body);
  res.json(playlist);
}

function destroy(req, res) {
  const id = Number(req.params.id);
  const index = playlists.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Playlist not found" });

  const deleted = playlists.splice(index, 1);
  res.json(deleted[0]);
}


module.exports = { index, show, create, update, destroy }