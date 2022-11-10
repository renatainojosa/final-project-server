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
        enum: ['dog', 'cat']
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'not identified']
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
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true})

module.exports = model('Pet', petSchema);