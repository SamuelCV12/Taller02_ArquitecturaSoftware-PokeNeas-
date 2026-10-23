require('dotenv').config();

const express = require('express');
const path = require('node:path');
const pokeneaRoutes = require('./routes/pokeneaRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandlers');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', pokeneaRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Pokeneas disponible en el puerto ${port}`);
  });
}

module.exports = app;
