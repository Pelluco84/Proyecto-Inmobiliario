const express = require('express');
const db = require('../db');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../img'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});


const upload = multer({ storage });

router.get('/usuarios', (req, res) => {
  const sql = `
    SELECT id_usuario, nombre, correo, estado
    FROM usuario
    WHERE estado = 'activo'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al cargar usuarios' });
    }
    res.json(results);
  });
});


router.get('/solicitudes', (req, res) => {
  const sql = `
    SELECT 
      s.id_solicitud,
      s.fecha_solicitud,
      s.mensaje,
      s.estado,
      u.nombre AS nombre_usuario,
      c.titulo AS titulo_casa
    FROM solicitud_contacto s
    INNER JOIN usuario u ON s.id_usuario = u.id_usuario
    INNER JOIN casa c ON s.id_casa = c.id_casa
    ORDER BY 
      CASE 
        WHEN s.estado = 'Pendiente' THEN 1
        ELSE 2
      END
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al cargar solicitudes' });
    }
    res.json(results);
  });
});


 // BLOQUEAR (ELIMINAR LÓGICAMENTE) USUARIO
router.put('/usuarios/:id/eliminar', (req, res) => {
  const sql = "UPDATE usuario SET estado = 'bloqueado' WHERE id_usuario = ?";

  db.query(sql, [req.params.id], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
});


router.post('/propiedades', (req, res) => {
  const { titulo, descripcion, precio, sector, estado } = req.body;

  const sql = `
    INSERT INTO casa (titulo, descripcion, precio, sector, estado, fecha_publicacion)
    VALUES (?, ?, ?, ?, ?, CURDATE())
  `;

  db.query(sql, [titulo, descripcion, precio, sector, estado], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al agregar propiedad' });
    }
    res.json({ mensaje: 'Propiedad agregada correctamente' });
  });
});

router.put('/propiedades/:id', (req, res) => {
  const { titulo, descripcion, precio, sector, estado } = req.body;

  const sql = `
    UPDATE casa
    SET titulo=?, descripcion=?, precio=?, sector=?, estado=?
    WHERE id_casa=?
  `;

  db.query(sql, [titulo, descripcion, precio, sector, estado, req.params.id], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al editar propiedad' });
    }
    res.json({ mensaje: 'Propiedad actualizada' });
  });
});

// ELIMINAR LÓGICAMENTE PROPIEDAD
router.put('/propiedades/:id/eliminar', (req, res) => {
  const sql = "UPDATE casa SET estado = 'eliminada' WHERE id_casa = ?";

  db.query(sql, [req.params.id], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar propiedad' });
    }
    res.json({ mensaje: 'Propiedad eliminada correctamente' });
  });
});

// LISTAR PROPIEDADES (NO ELIMINADAS)
router.get('/propiedades', (req, res) => {
  const sql = `
    SELECT *
    FROM casa
    WHERE estado <> 'eliminada'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al cargar propiedades' });
    }
    res.json(results);
  });
});


// SUBIR IMÁGENES A UNA CASA (ADMIN)

router.post('/propiedades/:id/imagenes', upload.array('imagenes', 8), (req, res) => {
  const idCasa = req.params.id;

  // Contar imágenes actuales
  db.query(
    'SELECT COUNT(*) AS total FROM imagen WHERE id_casa = ?',
    [idCasa],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al validar imágenes' });
      }

      const totalActual = rows[0].total;
      const nuevas = req.files.length;

      if (totalActual + nuevas > 8) {
        return res.status(400).json({
          mensaje: 'Máximo 8 imágenes por propiedad'
        });
      }

      const values = req.files.map(file => [
        file.filename,
        idCasa
      ]);

      db.query(
        'INSERT INTO imagen (url_imagen, id_casa) VALUES ?',
        [values],
        err => {
          if (err) {
            return res.status(500).json({ mensaje: 'Error al guardar imágenes' });
          }

          res.json({ mensaje: 'Imágenes subidas correctamente' });
        }
      );
    }
  );
});

// MARCAR SOLICITUD COMO RESUELTA
router.put('/solicitudes/:id', (req, res) => {
  const sql = `
    UPDATE solicitud_contacto
    SET estado = 'Resuelto'
    WHERE id_solicitud = ?
  `;

  db.query(sql, [req.params.id], err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al actualizar solicitud' });
    }

    res.json({ mensaje: 'Solicitud marcada como resuelta' });
  });
});


module.exports = router;
