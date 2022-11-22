const { Schema, model } = require('mongoose');

const petSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    category: {
        type: Boolean,  
        required: true,
        enum: ['dog', 'cat']
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'I don\'t know'
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
        type: Boolean,
    },
    vaccinated: {
        type: Boolean,
    },
    profileImgUrl: {
        type: String,
        default: 'images/default-avatar.png'
    },
    ownerId: {type: Schema.Types.ObjectId},
}, { timestamps: true})

module.exports = model('Pet', petSchema);