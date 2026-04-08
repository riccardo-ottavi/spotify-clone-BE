const db = require('../data/db');

async function index(req, res) {
  try {
    const [results] = await db.query('SELECT * FROM artists');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero degli artisti' });
  }
}

async function show(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid artist ID' });

  try {
    const [results] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Artist not found' });
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero dell\'artista' });
  }
}

module.exports = { index, show };