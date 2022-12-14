//pacotes
require('dotenv/config');
const express = require('express');
const { isAuthenticated } = require('./middlewares/jwt.middleware');
const app = express();

//banco de dados
require('./db');

//configurações
require('./configs')(app);

//rotas
app.use('/auth', require('./routes/auth.routes'));
app.use('/auth-ongs', require('./routes/auth.ong.routes'))
app.use('/pets', isAuthenticated, require('./routes/pets.routes'));

//erros
require('./error-handling')(app);

//exportar app
module.exports = app;

