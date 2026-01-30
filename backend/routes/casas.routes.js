const express = require('express');
const db = require('../db');

const router = express.Router();

/**
 
 * Obtiene listado de casas con filtros opcionales 
 */
router.get('/', (req, res) => {
  const { sector, estado, precio } = req.query;

  let sql = `
    SELECT 
      c.id_casa,
      MIN(c.titulo) AS titulo,
      MIN(c.descripcion) AS descripcion,
      MIN(c.precio) AS precio,
      MIN(c.sector) AS sector,
      MIN(c.estado) AS estado,
      GROUP_CONCAT(i.url_imagen ORDER BY i.id_imagen) AS imagenes
    FROM casa c
    LEFT JOIN imagen i ON c.id_casa = i.id_casa
    WHERE c.estado <> 'eliminada'

  `;

  const params = [];

  if (sector) {
    sql += ' AND c.sector LIKE ?';
    params.push(`%${sector}%`);
  }

  if (estado) {
    sql += ' AND c.estado = ?';
    params.push(estado);
  }

  if (precio) {
    sql += ' AND c.precio <= ?';
    params.push(precio);
  }

  sql += ' GROUP BY c.id_casa';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error SQL /casas:', err);
      return res.status(500).json({ mensaje: 'Error al obtener casas' });
    }

    // Convertir imágenes a arreglo y limitar a 8
    results.forEach(casa => {
      casa.imagenes = casa.imagenes
        ? casa.imagenes.split(',').slice(0, 8)
        : [];
    });

    res.json(results);
  });
});



 
router.get('/:id', (req, res) => {
  const sql = `
    SELECT 
      c.id_casa,
      c.titulo,
      c.descripcion,
      c.precio,
      c.sector,
      c.estado,
      GROUP_CONCAT(i.url_imagen ORDER BY i.id_imagen) AS imagenes
    FROM casa c
    LEFT JOIN imagen i ON c.id_casa = i.id_casa
    WHERE c.id_casa = ?
    GROUP BY c.id_casa
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al cargar propiedad' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
    }

    const casa = results[0];

    casa.imagenes = casa.imagenes
      ? casa.imagenes.split(',')
      : [];

    res.json(casa);
  });
});


module.exports = router;
