const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/],
    },
    contact: {
        type: Number,
        unique: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    profileImgUrl: {
        type: String,
        default: 'images/default-avatar.png'
    },
    type: 'User',
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet'}]
}, { timestamps: true });

module.exports = model('User', userSchema);