import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';

// Importar rutas de mi archivo routes/auth.js, es mi ruta base backend
import authRoutes from './routes/auth.js';
// import productRoutes from './routes/product.js';

import sequelize from './config/database.js';
//import './models/Login.jsx';

import { requestLogger, errorLogger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 



/*  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});     */

// --------------------
// Middlewares
// --------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(requestLogger);
app.use(errorLogger);

// --------------------
// Rutas básicas
// --------------------
// app.get('/api/health', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'Servidor funcionando correctamente',
//         timestamp: new Date().toISOString(),
//         environment: process.env.NODE_ENV
//     });
// });

// app.get('/api/test', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'Ruta de prueba funcionando correctamente',
//         data: {
//             version: '1.0.0',
//             author: 'Alta Cedeño',
//             description: 'Backend para SPA React con autenticación JWT'
//         }
//     });
// });

// --------------------
// Rutas principales la cual debo colocar en Fronted fetch en UserRegister.jsx
// -------------------
app.use('/api/auth', authRoutes);




// // --------------------
// // 404
// // --------------------
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Ruta no encontrada: ${req.originalUrl}`,
//         suggestion: 'Verifique la URL e intente nuevamente'
//     });
// });

// --------------------
// Manejo global de errores
// --------------------
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// --------------------
// Arranque del servidor
// --------------------
(async () => {
    try {
        // Conexión Sequelize
        await sequelize.authenticate();
        console.log('📌 Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos (crear/actualizar tablas)
        await sequelize.sync({ alter: true });
        console.log('📌 Tablas sincronizadas correctamente.');

        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log(`🚀 Servidor backend iniciado`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔌 Puerto: ${PORT}`);
            console.log(`🩺 Health-check: http://localhost:${PORT}/api/auth`);
            console.log('='.repeat(50) + '\n');
        });

    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
        process.exit(1);
    }
})();

// --------------------
// Cierre graceful
// --------------------
process.on('SIGINT', async () => {
    console.log('🛑 Cerrando servidor correctamente...');
    await sequelize.close();
    process.exit(0);
});

export default app;
