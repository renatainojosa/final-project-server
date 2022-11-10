const router = require('express').Router();

const User = require('../models/User.model')
const Pet = require('../models/Pet.model')

router.post('/new-pet', async (req, res, next) => {
    const { name, description, category, gender, breed, age, color, castrated, vaccinated, profileImgUrl, userId } = req.body;
    const {_id} = req.payload;

    try {
        const petFromDB = await Pet.create({name, description, category, gender, breed, age, color, castrated, vaccinated, profileImgUrl, userId: _id});
        await User.findByIdAndUpdate(_id, { $push: {pets: petFromDB._id}}, {new: true})
        res.status(200).json(petFromDB)
    } catch (error) {
        console.error('Error trying to create pet', error);
        next(error)
    }
});

router.get('/', async (req, res, next) => {
    try {
        const petsFromDB = await Pet.find()
        res.status(200).json(petsFromDB)
    } catch (error) {
        next(error)
    }
});

module.exports = router;