//pacotes
require('dotenv/config');
const express = require('express');
const app = express();

//banco de dados

//configurações

//rotas

//erros
require('./error-handling')(app);

//exportar app
module.exports = app;

