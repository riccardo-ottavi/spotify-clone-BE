const db = require('../data/db');

function index(req, res) {
  db.query('SELECT * FROM artists', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
}

function show(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid artist ID' });

  db.query('SELECT * FROM artists WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Artist not found' });
    res.json(results[0]);
  });
}

module.exports = { index, show };