const { Schema, model } = require("mongoose");

const todoSchema = new Schema({
    title: String,
    complete: {
        type: Boolean,
        default: false,
    }
});

module.exports = model('Todo', todoSchema)