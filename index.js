const express = require('express');
const sequelize = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('./config/Auth'); // Asegúrate de que este archivo no intente conectarse a la DB o definir rutas directamente

const app = express();

const VERCEL_PROD_DOMAIN = 'https://tp-4-desarrollo-de-software-cliente.vercel.app';
const STATIC_ALLOWED_ORIGINS = [
  'http://localhost:5173',
];

function isVercelFrontendOrigin(origin) {
  return origin && origin.endsWith('.vercel.app') && origin.includes('tp-4-desarrollo-de-software-cliente');
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/$/, '');

    if (
        cleanOrigin === VERCEL_PROD_DOMAIN ||
        STATIC_ALLOWED_ORIGINS.includes(cleanOrigin) ||
        isVercelFrontendOrigin(cleanOrigin)
    ) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS no permitido por el servidor'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_de_sesion_aqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// === Tus rutas de API ===
app.use('/api/yahoo', require('./routes/yahoo_finance'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/price-history', require('./routes/priceHistoryRoutes'));
app.use('/api/auth', require('./routes/auth')); // <--- Aquí se montan tus rutas de autenticación, incluyendo Google OAuth

// === Conexión a la base de datos y arranque del servidor ===
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