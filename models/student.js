const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    classroom: {
        type: String,
        required: true,
    },
    dob: Date,
    photo: {
        type: String,
        default: '/imgs/default-student.png'
    }
}, {timestamps: true});

module.exports = mongoose.model('Student', studentSchema);