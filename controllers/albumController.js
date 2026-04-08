const db = require('../data/db');

function index(req, res) {
    const sql = `
    SELECT 
  a.id,
  a.title,
  a.artist_id AS artistId,
  a.year,
  a.image,
  GROUP_CONCAT(asg.song_id ORDER BY asg.song_id) AS songIds
FROM albums a
LEFT JOIN albums_songs asg ON a.id = asg.album_id
GROUP BY a.id
ORDER BY a.id;
  `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        // Converti la stringa di songIds in array di numeri
        const albums = results.map(row => ({
            ...row,
            songIds: row.songIds ? row.songIds.split(',').map(Number) : []
        }));

        res.json(albums);
    });
}

function show(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid album ID' });

    const sql = `
    SELECT 
      a.id,
      a.title,
      a.artistId,
      a.year,
      a.image,
      GROUP_CONCAT(asg.song_id ORDER BY asg.song_id) AS songIds
    FROM albums a
    LEFT JOIN albums_songs asg ON a.id = asg.album_id
    WHERE a.id = ?
    GROUP BY a.id
  `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Album not found' });

        const album = results[0];
        album.songIds = album.songIds ? album.songIds.split(',').map(Number) : [];
        res.json(album);
    });
}

module.exports = { index, show };