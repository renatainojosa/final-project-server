const { Schema, model } = require('mongoose');

const petSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    category: {
        type: String,  
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        default: 'I don\'t know'
    },
    age: {
        type: Number,
    },
    color: {
        type: String
    },
    castrated: {
        type: String,
    },
    vaccinated: {
        type: String,
    },
    profileImgUrl: {
        type: String,
        default: 'images/default-avatar.png'
    },
    ownerId: {type: Schema.Types.ObjectId},
}, { timestamps: true})

module.exports = model('Pet', petSchema);