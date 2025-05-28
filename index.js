const express = require('express');
const sequelize = require('./db');
const User = require('./models/User');
const Investment = require('./models/Investment');
const Portfolio = require('./models/Portfolio');
const New = require('./models/New');
const PriceHistory = require('./models/PriceHistory');
const yahooRoutes = require('./routes/yahoo_finance');

const app = express();
app.use(express.json());
app.use('/api/yahoo', yahooRoutes);

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