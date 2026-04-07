const express = require('express');
const cors = require('cors');
const path = require('path');
const { getPool, testConnection } = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));


const normasRoutes = require('./routes/normas');
const usuariosRoutes = require('./routes/usuarios');
const riesgoRoutes = require('./routes/riesgo');
const chequeoRoutes = require('./routes/chequeo');
const notificacionesRoutes = require('./routes/notificaciones');


app.use('/api/normas', normasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/riesgo', riesgoRoutes);
app.use('/api/chequeo', chequeoRoutes);
app.use('/api/notificaciones', notificacionesRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


if (require.main === module) {
    app.listen(PORT, async () => {
        console.log(`🚀 Servidor R.I.D.E. corriendo en:`);
        console.log(`   📱 Frontend: http://localhost:${PORT}`);
        console.log(`   🔌 API: http://localhost:${PORT}/api/normas`);
        console.log(`   👤 Usuarios: http://localhost:${PORT}/api/usuarios`);
        console.log(`   Presiona Ctrl+C para detener`);
        
    // Probar conexión a MySQL
        await testConnection();
    });
}

module.exports = app;