const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
