const db = require('../data/db');

// --- Playlists ---
const index = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM playlists');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero delle playlist' });
  }
};

const show = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

  try {
    const [results] = await db.query('SELECT * FROM playlists WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Playlist not found' });
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero della playlist' });
  }
};

const create = async (req, res) => {
  const { name, image, notes } = req.body;
  const sql = 'INSERT INTO playlists (name, image, notes) VALUES (?, ?, ?)';
  try {
    const [result] = await db.query(sql, [
      name || 'Nuova playlist',
      image || '/images/new-playlist.png',
      notes || ''
    ]);
    res.status(201).json({ id: result.insertId, name, image, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nella creazione della playlist' });
  }
};

const update = async (req, res) => {
  const id = Number(req.params.id);
  const { name, image, notes } = req.body;

  const fields = [];
  const values = [];
  if (name) { fields.push('name = ?'); values.push(name); }
  if (image) { fields.push('image = ?'); values.push(image); }
  if (notes) { fields.push('notes = ?'); values.push(notes); }

  if (!fields.length) return res.status(400).json({ message: 'Nessun campo da aggiornare' });

  const sql = `UPDATE playlists SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Playlist not found' });

    const [updated] = await db.query('SELECT * FROM playlists WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nell\'aggiornamento della playlist' });
  }
};

const destroy = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

  try {
    const [result] = await db.query('DELETE FROM playlists WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Playlist not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nella cancellazione della playlist' });
  }
};

// --- Playlist Songs ---
const getSongs = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

  const sql = `SELECT songs.* 
               FROM songs 
               JOIN playlist_songs ON songs.id = playlist_songs.song_id 
               WHERE playlist_songs.playlist_id = ?`;

  try {
    const [results] = await db.query(sql, [id]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero delle canzoni della playlist' });
  }
};

const addSong = async (req, res) => {
  const playlistId = Number(req.params.id);
  const { song_id } = req.body;
  if (isNaN(playlistId) || !song_id) return res.status(400).json({ message: 'playlist_id o song_id mancante' });

  try {
    await db.query('INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)', [playlistId, song_id]);
    res.status(201).json({ playlistId, song_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nell\'aggiunta della canzone alla playlist' });
  }
};

const removeSong = async (req, res) => {
  const playlistId = Number(req.params.id);
  const songId = Number(req.params.songId);
  if (isNaN(playlistId) || isNaN(songId)) return res.status(400).json({ message: 'playlist_id o song_id non valido' });

  try {
    const [result] = await db.query('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?', [playlistId, songId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Canzone non trovata nella playlist' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nella rimozione della canzone dalla playlist' });
  }
};

module.exports = { 
  index, show, create, update, destroy, 
  getSongs, addSong, removeSong 
};