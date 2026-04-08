const db = require('../data/db');

async function index(req, res) {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, a.name AS artistName, al.title AS albumTitle
      FROM songs s
      LEFT JOIN artists a ON s.artistId = a.id
      LEFT JOIN albums al ON s.albumId = al.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero delle canzoni' });
  }
}

async function show(req, res) {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.execute(`
      SELECT s.*, a.name AS artistName, al.title AS albumTitle
      FROM songs s
      LEFT JOIN artists a ON s.artistId = a.id
      LEFT JOIN albums al ON s.albumId = al.id
      WHERE s.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Song not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero della canzone' });
  }
}

module.exports = { index, show };