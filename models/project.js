const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    photo: {
        type: String,
        default: '/imgs/default-project'
    },
    dateMade: {
        type: Date,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
}, {timestamps: true});

module.exports = mongoose.model('Project', projectSchema);