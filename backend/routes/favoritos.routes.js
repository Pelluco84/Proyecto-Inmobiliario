const express = require('express');
const db = require('../db');

const router = express.Router();

/* AGREGAR FAVORITO */
router.post('/', (req, res) => {
  const { id_usuario, id_casa } = req.body;

  const sql = `
    INSERT INTO favorito (fecha_agregado, id_usuario, id_casa)
    VALUES (CURDATE(), ?, ?)
  `;

  db.query(sql, [id_usuario, id_casa], (err) => {
    if (err) {
      return res.status(400).json({ mensaje: 'Ya está en favoritos' });
    }
    res.json({ mensaje: 'Agregado a favoritos' });
  });
});

/* LISTAR FAVORITOS */
router.get('/:id_usuario', (req, res) => {
  const sql = `
    SELECT c.*
    FROM favorito f
    JOIN casa c ON f.id_casa = c.id_casa
    WHERE f.id_usuario = ?
  `;

  db.query(sql, [req.params.id_usuario], (err, results) => {
    res.json(results);
  });
});

module.exports = router;
