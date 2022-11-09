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
        default: 'I don\'t know',
    },
    age: {
        type: Number,
        default: 'I don\'t know'
    },
    color: {
        type: String
    },
    castrated: {
        type: Boolean,
        default: 'I don\'t know'
    },
    vaccinated: {
        type: Boolean,
        default: 'I don\'t know'
    },
    profileImgUrl: {
        type: String,
        default: 'images/default-avatar.png'
    },
    owner: [{ type: Schema.Types.ObjectId, ref: 'User'}],
}, { timestamps: true})

module.exports = model('Pet', petSchema);