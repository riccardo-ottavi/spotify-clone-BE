const db = require('../data/db');

// Ottieni tutte le playlist
function index(req, res) {
    db.query('SELECT * FROM playlists', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
}

// Ottieni una playlist specifica
function show(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

    db.query('SELECT * FROM playlists WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "Playlist not found" });
        res.json(results[0]);
    });
}

// Crea una nuova playlist
function create(req, res) {
    const { name, image, notes } = req.body;
    const newPlaylist = {
        name: name || 'Nuova playlist',
        image: image || '/new-playlist.png',
        notes: notes || ''
    };

    const sql = 'INSERT INTO playlists (name, image, notes) VALUES (?, ?, ?)';
    db.query(sql, [newPlaylist.name, newPlaylist.image, newPlaylist.notes], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, ...newPlaylist });
    });
}

// Aggiorna una playlist esistente
function update(req, res) {
    const id = Number(req.params.id);
    const { name, image, notes } = req.body;

    // Crea array dinamico per SQL e valori
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }

    if (fields.length === 0) return res.status(400).json({ message: 'Nessun campo da aggiornare' });

    const sql = `UPDATE playlists SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Playlist not found' });

        // Ritorna oggetto aggiornato
        db.query('SELECT * FROM playlists WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results[0]);
        });
    });
}

// Elimina una playlist
function destroy(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

    db.query('DELETE FROM playlists WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Playlist not found" });
        res.status(204).send(); // eliminazione senza contenuto
    });
}

// Ottieni tutte le canzoni di una playlist
function getSongs(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid playlist ID' });

    const sql = `
        SELECT songs.* 
        FROM songs
        JOIN playlist_songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
}

// Aggiungi una canzone a una playlist
function addSong(req, res) {
    const playlistId = Number(req.params.id);
    const { song_id } = req.body;

    if (isNaN(playlistId) || !song_id) {
        return res.status(400).json({ message: "playlist_id o song_id mancante" });
    }

    const sql = `INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)`;
    db.query(sql, [playlistId, song_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Errore nell'aggiunta della canzone" });
        }
        res.status(201).json({ playlistId, song_id });
    });
}



module.exports = { index, show, create, update, destroy, getSongs, addSong };