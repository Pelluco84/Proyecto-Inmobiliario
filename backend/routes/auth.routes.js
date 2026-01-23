const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

/* REGISTRO */
router.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const hash = await bcrypt.hash(contrasena, 10);

  const sql = `
    INSERT INTO usuario (nombre, correo, contrasena, fecha_registro, estado, id_rol)
    VALUES (?, ?, ?, CURDATE(), 'activo', 1)
  `;

  db.query(sql, [nombre, correo, hash], (err) => {
    if (err) {
      return res.status(400).json({ mensaje: 'Correo ya registrado' });
    }
    res.json({ mensaje: 'Usuario registrado correctamente' });
  });
});

/* LOGIN */
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = `
    SELECT u.*, r.nombre_rol
    FROM usuario u
    INNER JOIN rol r ON u.id_rol = r.id_rol
    WHERE u.correo = ?
  `;

  db.query(sql, [correo], async (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (results.length === 0) {
  return res.status(404).json({ mensaje: 'Usuario no registrado' });
}

    

    const usuario = results[0];

    // 🔒 Verificar estado
    if (usuario.estado !== 'activo') {
      return res.status(403).json({ mensaje: 'Usuario bloqueado' });
    }

    // 🔐 Comparar contraseña cifrada
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!match) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    res.json({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.nombre_rol
    });
  });
});

    


/* RECUPERAR CONTRASEÑA */
router.post('/recuperar', async (req, res) => {
  const { correo } = req.body;

  const nueva = Math.random().toString(36).slice(-8);
  const hash = await bcrypt.hash(nueva, 10);

  const sql = `
    UPDATE usuario SET contrasena = ?
    WHERE correo = ?
  `;

  db.query(sql, [hash, correo], (err, result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Correo no encontrado' });
    }

    res.json({
      mensaje: 'Contraseña restablecida',
      nueva_contrasena: nueva
    });
  });
});

module.exports = router;
