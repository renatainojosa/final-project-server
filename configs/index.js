const { json, urlencoded } = require('express');
const cors = require('cors');
const logger = require('morgan');

module.exports = (app) => {
    app.set('trust proxy', 1);

    const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:3000';

    app.use(cors({
        origin: [FRONTEND_URL],
    }));

    app.use(logger('dev'));

    app.use(json());
    app.use(urlencoded({extended: false}));
}