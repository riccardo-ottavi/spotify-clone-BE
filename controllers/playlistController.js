const db = require('../data/db');

// --- Playlists ---
const index = (req, res) => {
  db.query('SELECT * FROM playlists', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const show = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

  db.query('SELECT * FROM playlists WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results[0]) return res.status(404).json({ message: 'Playlist not found' });
    res.json(results[0]);
  });
};

const create = (req, res) => {
  const { name, image, notes } = req.body;
  const sql = 'INSERT INTO playlists (name, image, notes) VALUES (?, ?, ?)';
  db.query(sql, [name || 'Nuova playlist', image || '/images/new-playlist.png', notes || ''], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, name, image, notes });
  });
};

const update = (req, res) => {
  const id = Number(req.params.id);
  const { name, image, notes } = req.body;

  const fields = [];
  const values = [];
  if (name) fields.push('name = ?') && values.push(name);
  if (image) fields.push('image = ?') && values.push(image);
  if (notes) fields.push('notes = ?') && values.push(notes);
  if (!fields.length) return res.status(400).json({ message: 'Nessun campo da aggiornare' });

  const sql = `UPDATE playlists SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Playlist not found' });

    db.query('SELECT * FROM playlists WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    });
  });
};

const destroy = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

  db.query('DELETE FROM playlists WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Playlist not found' });
    res.status(204).send();
  });
};

// --- Playlist Songs ---
const getSongs = (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

  const sql = `SELECT songs.* FROM songs JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const addSong = (req, res) => {
  const playlistId = Number(req.params.id);
  const { song_id } = req.body;
  if (isNaN(playlistId) || !song_id) return res.status(400).json({ message: 'playlist_id o song_id mancante' });

  db.query('INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)', [playlistId, song_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ playlistId, song_id });
  });
};

const removeSong = (req, res) => {
  const playlistId = Number(req.params.id);
  const songId = Number(req.params.songId);
  if (isNaN(playlistId) || isNaN(songId)) return res.status(400).json({ message: 'playlist_id o song_id non valido' });

  db.query('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?', [playlistId, songId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Canzone non trovata nella playlist' });
    res.status(204).send();
  });
};

module.exports = { index, show, create, update, destroy, getSongs, addSong, removeSong };