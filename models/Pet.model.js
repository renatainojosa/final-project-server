const { Schema, model } = require('mongoose');

const petSchema = new Schema({
    name: {
        type: String,
    },
    category: {
        type: String,  
        enum: ['dog', 'cat']
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    breed: {
        type: String,
    },
    age: {
        type: Number
    },
    color: {
        type: String
    },
    castrated: {
        type: Boolean
    },
    vaccinated: {
        type: Boolean
    },
    owner: [{ type: Schema.Types.ObjectId, ref: 'User'}]
}, { timestamps: true})

module.exports = model('Pet', petSchema);