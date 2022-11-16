const { json, urlencoded } = require('express');
const cors = require('cors');
const logger = require('morgan');

module.exports = (app) => {
    app.set('trust proxy', 1);

    app.use(cors());

    app.use(logger('dev'));

    app.use(json());
    app.use(urlencoded({extended: false}));
}