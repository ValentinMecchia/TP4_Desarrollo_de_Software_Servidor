const express = require('express');
const sequelize = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('./config/Auth');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://tp4-desarrollo-de-software-servidor.onrender.com',
    'https://tp-4-desarrollo-de-software-cliente.vercel.app',
];

app.use((req, res, next) => {
    console.log('🔍 Headers de la solicitud:', req.headers);
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) {
            console.log('🌐 Sin origin (probablemente OAuth o backend): permitido');
            return callback(null, true);
        }

        const cleanOrigin = origin.replace(/\/$/, '');
        console.log('🌐 Solicitud con origin:', cleanOrigin);

        if (
            allowedOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS no permitido por el servidor'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

console.log('🌍 Modo actual:', process.env.NODE_ENV);

app.use(session({
    secret: 'secreto123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',   // true solo si está en producción (y con HTTPS)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('Backend Request - Session ID:', req.sessionID);
    console.log('Backend Request - User (from session):', req.user ? req.user.email : 'Not authenticated');
    next();
});

app.use('/api/yahoo', require('./routes/yahoo_finance'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/price-history', require('./routes/priceHistoryRoutes'));
app.use('/api/auth', require('./routes/auth'));

sequelize.authenticate()
    .then(() => {
        console.log('🟢 Conectado a la DB');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
    })
    .catch(err => console.error('Error al conectar:', err));
