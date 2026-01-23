require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


const authRoutes = require('./routes/auth.routes');
const casasRoutes = require('./routes/casas.routes');
const favoritosRoutes = require('./routes/favoritos.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));



app.use('/api/auth', authRoutes);
app.use('/api/casas', casasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
