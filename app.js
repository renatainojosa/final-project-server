//pacotes
require('dotenv/config');
const express = require('express');
const app = express();

//banco de dados
require('./db');

//configurações
require('./configs')(app);

//rotas

//erros
require('./error-handling')(app);

//exportar app
module.exports = app;

