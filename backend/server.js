const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const normasRoutes = require('./routes/normas');
const chequeoRoutes = require('./routes/chequeo');
const riesgoRoutes = require('./routes/riesgo');
const usuariosRoutes = require('./routes/usuarios');
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../frontend')));


app.use('/api/normas', normasRoutes);
app.use('/api/chequeo', chequeoRoutes);
app.use('/api/riesgo', riesgoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/bicicleta', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/bicicleta.html'));
});

app.get('/moto', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/moto.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Servidor R.I.D.E. corriendo en:`);
    console.log(`   📱 Frontend: http://localhost:${PORT}`);
    console.log(`   🔌 API: http://localhost:${PORT}/api/normas`);
    console.log(`   👤 Usuarios: http://localhost:${PORT}/api/usuarios`);
    console.log(`\n   Presiona Ctrl+C para detener\n`);
});