const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
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
        default: 'https://res.cloudinary.com/dnmzvfkl2/image/upload/v1669160209/adopt-a-joseph/avatar-profile_ndg0cq.png'
    },
    type: {
        type: String,
        default: 'User'
    },
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet'}]
}, { timestamps: true });

module.exports = model('User', userSchema);