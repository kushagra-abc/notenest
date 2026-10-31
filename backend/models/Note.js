
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },

    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },

    tag: {
        type: String,
        trim: true,
        default: "General"
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', NotesSchema);
