const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'spotify_clone'
});

db.connect(err => {
  if (err) {
    console.error('Errore connessione DB:', err);
    return;
  }
  console.log('Connesso a MySQL');
});

module.exports = db;