const db = require('../data/db');

async function index(req, res) {
  try {
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

    const [results] = await db.query(sql);

    const albums = results.map(row => ({
      ...row,
      songIds: row.songIds ? row.songIds.split(',').map(Number) : []
    }));

    res.json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero degli album' });
  }
}

async function show(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid album ID' });

  try {
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
      WHERE a.id = ?
      GROUP BY a.id;
    `;

    const [results] = await db.query(sql, [id]);

    if (results.length === 0) return res.status(404).json({ message: 'Album not found' });

    const album = results[0];
    album.songIds = album.songIds ? album.songIds.split(',').map(Number) : [];
    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero dell\'album' });
  }
}

module.exports = { index, show };