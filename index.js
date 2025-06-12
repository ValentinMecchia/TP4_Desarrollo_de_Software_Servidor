const express = require('express');
const sequelize = require('./db');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('./config/Auth');

const yahooRoutes = require('./routes/yahoo_finance');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secreto123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/yahoo', yahooRoutes);
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
        console.log('📦 Modelos sincronizados');
        app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
    })
    .catch(err => console.error('Error al conectar:', err));
