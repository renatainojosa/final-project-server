const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const mongoose = require('mongoose')

const User = require('../models/User.model');

const saltRounds = 10;

//rotas de autenticação
router.get('/users', async (req, res, next) => {
    try {
        const usersFromDB = await User.find()
        res.status(200).json(usersFromDB)        
    } catch (error) {
        next(error)
    }
});

router.post('/signup', async (req, res, next) => {
    const {username, email, password, contact} = req.body;
    try {
        if (!username || !email || !password || !contact) {
            const error = new Error('Campos de preenchimento obrigatório!');
            error.status = 400;
            throw error;
        }  

    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt);

    const userFromDB = await User.create({
        username,
        email,
        contact,
        passwordHash: hash,
    });
    res.status(201).json(userFromDB);
    } catch (error) {
        if(error instanceof mongoose.Error.ValidationError) {
            res.status(400).json(error.message);
            return;
        }
        if (error.code === 11000) {
            res.status(500).json('Nome de usuário ou email já existe');
            return;
        }
        next(error);
    }
})

module.exports = router;