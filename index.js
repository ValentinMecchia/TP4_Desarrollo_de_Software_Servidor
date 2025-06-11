const express = require('express');
const sequelize = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('./config/Auth');

const yahooRoutes = require('./routes/yahoo_finance');

const app = express();

// CORS - importante que esté antes de sesiones y rutas
app.use(cors({
    origin: 'http://localhost:5173',  // frontend
    credentials: true,                 // permite cookies y sesiones
}));

// Parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: 'secreto123',   // en producción usar variable de entorno
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,      // true solo si usas HTTPS
        sameSite: 'lax',    // 'none' si usas HTTPS y CORS cross-site
    }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/yahoo', yahooRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/price-history', require('./routes/priceHistoryRoutes'));
app.use('/api/auth', require('./routes/auth'));

// Conexión a DB y arranque del servidor
sequelize.authenticate()
    .then(() => {
        console.log('🟢 Conectado a la DB');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('📦 Modelos sincronizados');
        app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
    })
    .catch(err => console.error('Error al conectar:', err));
