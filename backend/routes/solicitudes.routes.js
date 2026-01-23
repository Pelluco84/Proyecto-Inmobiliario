const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/solicitudes', (req, res) => {
  const orden = req.query.orden || 'Pendiente';

  const sql = `
    SELECT s.id_solicitud, s.mensaje, s.estado,
           u.nombre AS nombre_usuario,
           c.titulo AS titulo_casa
    FROM solicitud_contacto s
    JOIN usuario u ON s.id_usuario = u.id_usuario
    JOIN casa c ON s.id_casa = c.id_casa
    ORDER BY s.estado = ? DESC
  `;

  db.query(sql, [orden], (err, results) => {
    res.json(results);
  });
});

router.put('/solicitudes/:id', (req, res) => {
  const sql = 'UPDATE solicitud_contacto SET estado = ? WHERE id_solicitud = ?';
  db.query(sql, ['Resuelto', req.params.id], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al actualizar estado' });
    }
    res.json({ mensaje: 'Solicitud marcada como resuelta' });
  });
});

router.post('/', (req, res) => {
  const { id_usuario, id_casa, mensaje } = req.body;

  const sql = `
    INSERT INTO solicitud_contacto
    (fecha_solicitud, mensaje, estado, id_usuario, id_casa)
    VALUES (CURDATE(), ?, 'Pendiente', ?, ?)
  `;

  db.query(sql, [mensaje, id_usuario, id_casa], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al enviar solicitud' });
    }
    res.json({ mensaje: 'Solicitud enviada correctamente' });
  });
});


module.exports = router;
